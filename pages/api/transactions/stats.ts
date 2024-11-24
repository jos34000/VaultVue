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
    const { accountId, period } = req.query;

    const startDate = new Date();
    if (period === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const stats = await prisma.transaction.groupBy({
      by: ["type", "cryptoId"],
      where: {
        accountId: accountId as string,
        date: {
          gte: startDate,
        },
      },
      _sum: {
        montantEUR: true,
        quantiteCrypto: true,
      },
      _count: true,
    });

    res.status(200).json(stats);
  } catch (error) {
    logError(
      "stats.ts",
      "handler",
      error instanceof Error ? error.message : "Erreur inconnue"
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des statistiques" });
  }
}
