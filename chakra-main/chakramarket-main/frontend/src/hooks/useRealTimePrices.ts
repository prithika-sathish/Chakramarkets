import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateHoldingPrices } from '../features/portfolio/portfolioSlice';
import { useGetStockDataQuery } from '../app/services/portfolio';
import type { RootState } from '../store';

export const useRealTimePrices = () => {
  const dispatch = useDispatch();
  const holdings = useSelector((state: RootState) => state.portfolio.holdings);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Get unique symbols from holdings
  const symbols = holdings.map(holding => holding.symbol);
  const uniqueSymbols = [...new Set(symbols)];

  // Skip query if no symbols
  const shouldSkip = uniqueSymbols.length === 0;

  // Query for stock data
  const { data: stockData, refetch } = useGetStockDataQuery(uniqueSymbols, {
    skip: shouldSkip,
    pollingInterval: 180000, // 3 minutes = 180,000 ms
  });

  // Update holdings with new prices when data changes
  useEffect(() => {
    if (stockData && stockData.length > 0) {
      const now = Date.now();
      
      // Prevent too frequent updates (minimum 30 seconds between updates)
      if (now - lastUpdateRef.current < 30000) {
        return;
      }

      const priceUpdates: { [symbol: string]: number } = {};
      
      stockData.forEach(stock => {
        if (stock.price > 0 && !stock.error) {
          priceUpdates[stock.symbol] = stock.price;
        }
      });

      if (Object.keys(priceUpdates).length > 0) {
        dispatch(updateHoldingPrices(priceUpdates));
        lastUpdateRef.current = now;
        console.log('Updated prices for:', Object.keys(priceUpdates));
      }
    }
  }, [stockData, dispatch]);

  // Manual refresh function
  const refreshPrices = async () => {
    if (!shouldSkip) {
      try {
        await refetch();
      } catch (error) {
        console.error('Failed to refresh prices:', error);
      }
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    refreshPrices,
    isUpdating: false, // Could be enhanced to show loading state
    lastUpdate: lastUpdateRef.current,
  };
};
