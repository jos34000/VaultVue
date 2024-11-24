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
      date,
    } = req.body;

    // Vérification du solde disponible
    const portfolio = await prisma.portfolio.findUnique({
      where: {
        accountId_cryptoId: {
          accountId,
          cryptoId,
        },
      },
    });

    if (!portfolio || portfolio.quantity < quantiteCrypto) {
      return res.status(400).json({ error: "Solde insuffisant" });
    }

    const transaction = await prisma.transaction.create({
      data: {
        accountId,
        cryptoId,
        type: "VENTE",
        montantEUR,
        prixUnitaire,
        quantiteCrypto,
        date: new Date(date),
      },
    });

    // Mise à jour du portfolio
    await prisma.portfolio.update({
      where: {
        accountId_cryptoId: {
          accountId,
          cryptoId,
        },
      },
      data: {
        quantity: {
          decrement: quantiteCrypto,
        },
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    logError(
      "sell.ts",
      "handler",
      error instanceof Error ? error.message : "Erreur inconnue"
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la transaction" });
  }
}
