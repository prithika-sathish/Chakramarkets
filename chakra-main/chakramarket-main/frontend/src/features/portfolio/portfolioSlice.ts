import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export interface PortfolioHolding {
  id: string;
  symbol: string;
  type: 'stock' | 'option';
  shares: number;
  currentPrice: number;
  purchasePrice: number;
  triggerPrice?: number;
  optionType?: 'CE' | 'PE';
  strike?: number;
  expiry?: string;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalInvestment: number;
  totalPnL: number;
  totalPnLPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
}

interface PortfolioState {
  holdings: PortfolioHolding[];
  metrics: PortfolioMetrics | null;
  benchmark: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  holdings: [],
  metrics: null,
  benchmark: 'SPY', // S&P 500 ETF as default benchmark
  isLoading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addHolding: (state, action: PayloadAction<PortfolioHolding>) => {
      state.holdings.push(action.payload);
    },
    updateHolding: (state, action: PayloadAction<PortfolioHolding>) => {
      const index = state.holdings.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.holdings[index] = action.payload;
      }
    },
    removeHolding: (state, action: PayloadAction<string>) => {
      state.holdings = state.holdings.filter(h => h.id !== action.payload);
    },
    setMetrics: (state, action: PayloadAction<PortfolioMetrics>) => {
      state.metrics = action.payload;
    },
    setBenchmark: (state, action: PayloadAction<string>) => {
      state.benchmark = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearPortfolio: (state) => {
      state.holdings = [];
      state.metrics = null;
      state.error = null;
    },
    updateHoldingPrices: (state, action: PayloadAction<{ [symbol: string]: number }>) => {
      const priceUpdates = action.payload;
      state.holdings.forEach(holding => {
        if (priceUpdates[holding.symbol] !== undefined) {
          holding.currentPrice = priceUpdates[holding.symbol];
        }
      });
    }
  }
});

export const {
  addHolding,
  updateHolding,
  removeHolding,
  setMetrics,
  setBenchmark,
  setLoading,
  setError,
  clearPortfolio,
  updateHoldingPrices,
} = portfolioSlice.actions;

// Selectors
export const getHoldings = (state: RootState) => state.portfolio.holdings;
export const getMetrics = (state: RootState) => state.portfolio.metrics;
export const getBenchmark = (state: RootState) => state.portfolio.benchmark;
export const getPortfolioLoading = (state: RootState) => state.portfolio.isLoading;
export const getPortfolioError = (state: RootState) => state.portfolio.error;

export default portfolioSlice.reducer;
