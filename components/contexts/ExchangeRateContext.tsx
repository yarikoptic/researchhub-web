import { useContext, createContext, useEffect, useState } from "react";
import numeral from "numeral";
import { fetchExchangeRate } from "~/config/fetch/exchangeRate";

type ContextType = {
  exchangeRate: number;
  rscToUSD: (rsc: number) => number;
  rscToUSDDisplay: (rsc: number) => string;
};

const ExchangeRateContext = createContext<ContextType>({
  exchangeRate: 0,
  rscToUSD: () => 0,
  rscToUSDDisplay: () => "",
});

export const useExchangeRate = () => useContext(ExchangeRateContext);

export const ExchangeRateContextProvider = ({ children }) => {
  const [exchangeRate, setExchangeRate] = useState(0);

  useEffect(() => {
    const asyncExchangeRate = async () => {
      const _exchangeRate = await fetchExchangeRate();
      setExchangeRate(_exchangeRate.results[0]?.real_rate);
    };

    asyncExchangeRate();
  }, []);

  const rscToUSD = (rsc: number) => {
    return rsc * exchangeRate;
  };

  const rscToUSDDisplay = (rsc: number) => {
    return numeral(rscToUSD(rsc)).format("$0,0.00");
  };

  return (
    <ExchangeRateContext.Provider
      value={{
        exchangeRate,
        rscToUSD,
        rscToUSDDisplay,
      }}
    >
      {children}
    </ExchangeRateContext.Provider>
  );
};

export default ExchangeRateContext;
