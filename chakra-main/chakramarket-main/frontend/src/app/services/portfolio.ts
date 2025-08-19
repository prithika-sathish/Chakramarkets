import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PortfolioHolding, PortfolioMetrics } from '../../features/portfolio/portfolioSlice';

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  error?: string;
}

export interface PortfolioAnalysis {
  metrics: PortfolioMetrics;
  allocation: Array<{
    symbol: string;
    percentage: number;
    value: number;
  }>;
  performance: Array<{
    date: string;
    value: number;
    benchmarkValue: number;
  }>;
  recommendations: Array<{
    type: 'buy' | 'sell' | 'hold' | 'rebalance';
    symbol: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export const portfolioApi = createApi({
  reducerPath: 'portfolioApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:6123/api/portfolio/',
  }),
  tagTypes: ['Portfolio', 'StockData'],
  endpoints: (builder) => ({
    getStockData: builder.query<StockData[], string[]>({
      query: (symbols) => ({
        url: 'stock-data',
        method: 'POST',
        body: { symbols },
      }),
      providesTags: ['StockData'],
    }),
    analyzePortfolio: builder.query<PortfolioAnalysis, { holdings: PortfolioHolding[]; benchmark: string }>({
      query: ({ holdings, benchmark }) => ({
        url: 'analyze',
        method: 'POST',
        body: { holdings, benchmark },
      }),
      providesTags: ['Portfolio'],
    }),
    getBenchmarkData: builder.query<StockData, string>({
      query: (symbol) => `benchmark/${symbol}`,
      providesTags: ['StockData'],
    }),
  }),
});

export const {
  useGetStockDataQuery,
  useAnalyzePortfolioQuery,
  useGetBenchmarkDataQuery,
} = portfolioApi;
