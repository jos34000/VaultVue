import getKlines from "@/api/binance/getKlines";
import { validateRequest } from "@/api/validation/validateRequest";
import { ValidationSchema } from "@/types/types";
import { NextApiRequest, NextApiResponse } from "next";

const fileName = "test";

const validationSchema: ValidationSchema = {
  method: ["GET", "POST"],
  query: {
    crypto: { required: true, type: "string" },
    date: { required: true, type: "string" },
    amount: { type: "number" },
  },
  body: {
    accountId: { required: true, type: "string" },
    montantEUR: { required: true, type: "number" },
    date: { required: true, type: "date" },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const validation = validateRequest(req, validationSchema, fileName);
  if (!validation.valid) {
    return res
      .status(validation.status || 400)
      .json({ error: validation.error });
  }

  try {
    if (req.method === "GET") {
      const { crypto, date } = validation.data?.query || {};
      const prices = await getKlines(crypto, date);
      return res.status(200).json(prices);
    }

    return res.status(200).json(validation.data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données" });
  }
}
