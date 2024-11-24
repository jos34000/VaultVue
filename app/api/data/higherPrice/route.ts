import getKlines from "@/lib/api/binance/getKlines";
import { validateRequest } from "@/lib/api/validation/validateRequest";
import { ValidationSchema } from "@/lib/types";
import logError from "@/lib/utils/logging/logs";
import { NextApiRequest, NextApiResponse } from "next";

const fileName = "higherPrice";

const validationSchema: ValidationSchema = {
  method: ["GET"],
  query: {
    crypto: { required: true, type: "string" },
    date: { required: true, type: "string" },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const validation = validateRequest(req, validationSchema, fileName);
  if (!validation.valid) {
    return res
      .status(validation.status ?? 400)
      .json({ error: validation.error });
  }

  const { crypto, date } = validation.data!.query!;

  try {
    const response = await getKlines(crypto.toUpperCase(), date);
    const cryptoData = response[crypto.toUpperCase()]?.EUR;

    if (typeof cryptoData === "object" && cryptoData !== null) {
      res.status(200).json({ high: cryptoData.high });
    } else {
      logError(
        fileName,
        "getKlines",
        `Données reçues non correctes : ${JSON.stringify(cryptoData)}`
      );
      res.status(404).json({
        error: "Données non trouvées",
        crypto,
        date,
        response: JSON.stringify(response),
      });
    }
  } catch (error) {
    logError(
      fileName,
      "handler",
      error instanceof Error ? error.message : "Erreur inconnue"
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données" });
  }
}
