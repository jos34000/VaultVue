import { fetchBinancePrice } from "@/lib/api/binance/fetchFinancePrice";

export const convertCurrency = async (
  amount: string,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    const priceInSource = parseFloat(amount.replace(",", "."));

    if (fromCurrency === toCurrency)
      return parseFloat(priceInSource.toFixed(6));

    const isUsdtToEur = fromCurrency === "USDT" && toCurrency === "EUR";
    const isEurToUsdt = fromCurrency === "EUR" && toCurrency === "USDT";

    const eurUsdtRate = await fetchBinancePrice("EURUSDT");

    if (isUsdtToEur)
      return parseFloat((priceInSource / eurUsdtRate).toFixed(6));
    if (isEurToUsdt)
      return parseFloat((priceInSource * eurUsdtRate).toFixed(6));

    const targetRate = await fetchBinancePrice(`EUR${toCurrency}`);
    return parseFloat((priceInSource * targetRate).toFixed(6));
  } catch (error) {
    return NaN;
  }
};
