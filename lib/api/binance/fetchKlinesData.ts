import { BINANCE_API_BASE_URL } from "@/lib/constants/currencies";

const fileName = "fetchKlinesData";

const fetchKlineData = async (
  symbol: string,
  fiat: string,
  startDate: number,
  endDate: number
) => {
  const response = await fetch(
    `${BINANCE_API_BASE_URL}/klines?symbol=${symbol}${fiat}&interval=1d&startTime=${startDate}&endTime=${endDate}`
  );

  if (!response.ok) {
    return null;
  }

  return await response.json();
};

export default fetchKlineData;
