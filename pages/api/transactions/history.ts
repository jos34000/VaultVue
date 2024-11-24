import { prisma } from "@/prisma";
import logError from "@/utils/logging/logs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { accountId, cryptoId, startDate, endDate, type } = req.query;

    const where = {
      accountId: accountId as string,
      ...(cryptoId && { cryptoId: cryptoId as string }),
      ...(type && {
        type: type as "ACHAT" | "VENTE" | "CONVERSION" | "TRANSFERT",
      }),
      ...(startDate &&
        endDate && {
          date: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        }),
    };

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        crypto: true,
        TransactionHistory: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json(transactions);
  } catch (error) {
    logError(
      "history.ts",
      "handler",
      error instanceof Error ? error.message : "Erreur inconnue"
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'historique" });
  }
}
