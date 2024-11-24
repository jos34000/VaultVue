import { prisma } from "@/prisma";
import logError from "@/utils/logging/logs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const {
      accountId,
      cryptoId,
      montantEUR,
      prixUnitaire,
      quantiteCrypto,
      convertCurrency,
      convertQuantity,
      date,
    } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        accountId,
        cryptoId,
        type: "CONVERSION",
        montantEUR,
        prixUnitaire,
        quantiteCrypto,
        isConverted: true,
        convertCurrency,
        convertQuantity,
        date: new Date(date),
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    logError(
      "convert.ts",
      "handler",
      error instanceof Error ? error.message : "Erreur inconnue"
    );
    res.status(500).json({ error: "Erreur lors de la conversion" });
  }
}
