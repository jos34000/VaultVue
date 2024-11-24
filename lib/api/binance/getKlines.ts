import { FIAT_CURRENCIES } from "@/lib/constants/currencies";
import { KlineData, PriceData, ValidationSchema } from "@/lib/types/types";
import clearDate from "@/lib/utils/formatting/clearDate";
import clearNumber from "@/lib/utils/formatting/clearNumber";
import { convertCurrency } from "@/lib/utils/formatting/convertCurrency";
import { toTimestamp } from "@/lib/utils/formatting/toTimestamp";
import logError from "@/lib/utils/logging/logs";
import { validateRequest } from "../validation/validateRequest";
import fetchKlineData from "./fetchKlinesData";

const fileName = "getKlines";

const validationSchema: ValidationSchema = {
  method: ["GET"],
  query: {
    crypto: { required: true, type: "string" },
    date: { required: true, type: "string" },
  },
};

const createPriceData = (item: any): PriceData => ({
  prixOuverture: parseFloat(item[1]),
  high: parseFloat(item[2]),
  low: parseFloat(item[3]),
  prixFermeture: parseFloat(item[4]),
});

const createKlineEntry = (item: any): KlineData => ({
  dateOuverture: clearDate(item[0]),
  dateFermeture: clearDate(item[6]),
});

async function convertPrice(
  price: string,
  from: string,
  to: string
): Promise<number> {
  return await convertCurrency(price, from, to);
}

async function convertPriceData(
  prices: PriceData,
  fromCurrency: string,
  toCurrency: string
): Promise<PriceData> {
  return {
    prixOuverture: await convertPrice(
      clearNumber(prices.prixOuverture),
      fromCurrency,
      toCurrency
    ),
    high: await convertPrice(
      clearNumber(prices.high),
      fromCurrency,
      toCurrency
    ),
    low: await convertPrice(clearNumber(prices.low), fromCurrency, toCurrency),
    prixFermeture: await convertPrice(
      clearNumber(prices.prixFermeture),
      fromCurrency,
      toCurrency
    ),
  };
}

const fetchEURData = async (
  symbol: string,
  startDate: number,
  endDate: number
): Promise<KlineData | null> => {
  try {
    const eurData = await fetchKlineData(symbol, "EUR", startDate, endDate);
    if (!eurData?.[0]) return null;

    const klineData = createKlineEntry(eurData[0]);
    klineData.EUR = createPriceData(eurData[0]);
    return klineData;
  } catch (error) {
    logError(fileName, "fetchEUR", error);
    return null;
  }
};

const fetchAlternativeFiatData = async (
  symbol: string,
  startDate: number,
  endDate: number
): Promise<KlineData | null> => {
  let lastError = null;

  for (const fiat of FIAT_CURRENCIES.filter((f) => f !== "EUR")) {
    try {
      const data = await fetchKlineData(symbol, fiat, startDate, endDate);
      if (!data?.[0]) continue;

      const klineData = createKlineEntry(data[0]);
      const prices = createPriceData(data[0]);
      klineData[fiat] = prices;

      if (fiat === "USDT") {
        klineData.EUR = await convertPriceData(prices, "USDT", "EUR");
      }
      return klineData;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    logError(fileName, "fetchAlternativeFiatData", "Aucune devise disponible");
  }
  return null;
};

const getKlines = async (
  crypto: string | undefined,
  date: string | undefined
): Promise<{ [crypto: string]: KlineData }> => {
  const validation = validateRequest(
    {
      method: "GET",
      url: `?crypto=${crypto}&date=${date}`,
      query: { crypto, date },
    } as any,
    validationSchema,
    fileName
  );

  if (!validation.valid || !validation.data?.query) {
    throw new Error(validation.error ?? "Validation failed");
  }

  const { crypto: validatedCrypto, date: validatedDate } =
    validation.data.query;
  const { startDate, endDate } = toTimestamp(validatedDate);
  const symbol = validatedCrypto.toUpperCase();

  try {
    const pricesByCrypto: { [key: string]: KlineData } = {};

    const eurData = await fetchEURData(symbol, startDate, endDate);
    if (eurData) {
      pricesByCrypto[symbol] = eurData;
      return pricesByCrypto;
    }

    const altData = await fetchAlternativeFiatData(symbol, startDate, endDate);
    if (altData) {
      pricesByCrypto[symbol] = altData;
      return pricesByCrypto;
    }

    logError(fileName, "getKlines", `Aucune donnée disponible pour ${symbol}`);
    return pricesByCrypto;
  } catch (error) {
    logError(fileName, "getKlines", error);
    throw error;
  }
};

export default getKlines;
