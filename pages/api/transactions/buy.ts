import { validateRequest } from "@/api/validation/validateRequest";
import { prisma } from "@/prisma";
import { ValidationSchema } from "@/types/types";
import { NextApiRequest, NextApiResponse } from "next";

const fileName = "buy";

const validationSchema: ValidationSchema = {
  method: ["POST"],
  body: {
    accountId: { required: true, type: "string" },
    cryptoId: { required: true, type: "string" },
    montantEUR: { required: true, type: "number" },
    prixUnitaire: { required: true, type: "number" },
    quantiteCrypto: { required: true, type: "number" },
    date: { required: true, type: "date" },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const validation = validateRequest(req, validationSchema, fileName);
  if (!validation.valid || !validation.data?.body) {
    return res
      .status(validation.status ?? 400)
      .json({ error: validation.error });
  }

  const {
    accountId,
    cryptoId,
    montantEUR,
    prixUnitaire,
    quantiteCrypto,
    date,
  } = validation.data.body;

  try {
    const transaction = await prisma.transaction.create({
      data: {
        accountId: accountId,
        cryptoId: cryptoId,
        montantEUR: montantEUR,
        prixUnitaire: prixUnitaire,
        quantiteCrypto: quantiteCrypto,
        date: date,
        type: "ACHAT",
      },
    });

    await prisma.portfolio.upsert({
      where: {
        accountId_cryptoId: {
          accountId: accountId,
          cryptoId: cryptoId,
        },
      },
      update: {
        quantity: {
          increment: quantiteCrypto,
        },
      },
      create: {
        accountId: accountId,
        cryptoId: cryptoId,
        quantity: quantiteCrypto,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la transaction" });
  }
}
