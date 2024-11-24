import { BINANCE_API_BASE_URL } from "@/lib/constants/currencies";
import logError from "@/lib/utils/logging/logs";

const fileName = "fetchBinancePrice";

export const fetchBinancePrice = async (symbol: string): Promise<number> => {
  try {
    const response = await fetch(
      `${BINANCE_API_BASE_URL}/ticker/price?symbol=${symbol}`
    );

    if (!response.ok) {
      throw new Error(`Impossible de récupérer le prix pour ${symbol}`);
    }

    const data = await response.json();
    return Number(data.price);
  } catch (error) {
    logError(fileName, "fetchBinancePrice", error);
    throw error;
  }
};
