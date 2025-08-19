import express from 'express';
import axios from 'axios';
import UserAgent from 'user-agents';
import { formatData, getPayoffData } from './utils.js';

const baseURL = 'https://www.nseindia.com/';

const getOptionsWithUserAgent = () => {
  const userAgent = new UserAgent();
  return {
    headers: {
      "Accept": "*/*",
      "User-Agent": userAgent.toString(),
      "Connection": "keep-alive",
    },
    withCredentials: true,
  };
};

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const MAX_RETRY_COUNT = 3;

const getOptionChainWithRetry = async (cookie, identifier, retryCount = 0) => {
  const isIndex = ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY"].includes(identifier);
  const apiEndpoint = "api/option-chain-" + (isIndex ? "indices" : "equities");
  const options = getOptionsWithUserAgent();
  try {
    const url = baseURL + apiEndpoint + "?symbol=" + encodeURIComponent(identifier);
    const response = await axios.get(url, { ...options, headers: { ...options.headers, Cookie: cookie } });
    const formattedData = formatData(response.data, identifier);
    return formattedData;

  } catch (error) {
    console.error(`Error fetching option chain. Retry count: ${retryCount}`, error);
    if (retryCount < MAX_RETRY_COUNT) {
      return getOptionChainWithRetry(cookie, identifier, retryCount + 1);
    } else {
      throw new Error('Failed to fetch option chain after multiple retries');
    };
  };
};

const getCookies = async () => {
  const options = getOptionsWithUserAgent();
  try {
    const response = await axios.get(baseURL + "option-chain", options);
    const cookie = response.headers['set-cookie'];
    return cookie;
  } catch (error) {
    console.error('Error fetching cookies:');
    throw new Error('Failed to fetch cookies');
  };
};

app.get('/open-interest', async (req, res) => {
  const now = new Date();
  const time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  console.log(`Request received at ${time}`);

  const { identifier } = req.query;

  if (!identifier) {
    res.status(400).json({ error: 'Invalid request. No identifier was given.' });
    return;
  };

  try {
    const cookie = await getCookies();
    const data = await getOptionChainWithRetry(cookie, identifier.toUpperCase());
    res.json(data).status(200).end();
  } catch (error) {
    console.error('Proxy request error: here', error);
    res.status(500).json({ error: 'Proxy request failed.' });
  };
});

app.post('/builder', async (req, res) => {
  const builderData = req.body;
  try {
    const payoff = getPayoffData(builderData);
    res.json(payoff).status(200).end();
  } catch (error) {
    console.error('Payoff calculation error:', error);
    res.status(500).json({ error: 'Payoff calculation failed.' });
  };
  
});

// Alpha Vantage API configuration
const ALPHA_VANTAGE_API_KEY = 'TKM4RK14XCQAM3EO';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Portfolio API endpoints
app.post('/api/portfolio/stock-data', async (req, res) => {
  const { symbols } = req.body;
  
  if (!symbols || !Array.isArray(symbols)) {
    return res.status(400).json({ error: 'Invalid symbols array' });
  }

  try {
    const stockDataPromises = symbols.map(async (symbol) => {
      try {
        const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol: symbol,
            apikey: ALPHA_VANTAGE_API_KEY
          }
        });

        const quote = response.data['Global Quote'];
        if (!quote) {
          throw new Error(`No data found for symbol: ${symbol}`);
        }

        return {
          symbol: symbol,
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume']),
        };
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error.message);
        return {
          symbol: symbol,
          price: 0,
          change: 0,
          changePercent: 0,
          volume: 0,
          error: error.message
        };
      }
    });

    const stockData = await Promise.all(stockDataPromises);
    res.json(stockData);
  } catch (error) {
    console.error('Portfolio stock data error:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.post('/api/portfolio/analyze', async (req, res) => {
  const { holdings, benchmark } = req.body;
  
  if (!holdings || !Array.isArray(holdings)) {
    return res.status(400).json({ error: 'Invalid holdings array' });
  }

  try {
    // Calculate portfolio metrics
    let totalValue = 0;
    let totalInvestment = 0;
    const allocation = [];

    for (const holding of holdings) {
      const marketValue = holding.currentPrice * holding.shares;
      const investmentValue = holding.purchasePrice * holding.shares;
      
      totalValue += marketValue;
      totalInvestment += investmentValue;
      
      allocation.push({
        symbol: holding.symbol,
        value: marketValue,
        percentage: 0 // Will be calculated after totalValue is known
      });
    }

    // Calculate percentages
    allocation.forEach(item => {
      item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
    });

    const totalPnL = totalValue - totalInvestment;
    const totalPnLPercentage = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

    // Generate mock performance data (in a real app, this would come from historical data)
    const performance = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const portfolioValue = totalValue * (1 + variation);
      const benchmarkValue = totalValue * (1 + variation * 0.8); // Benchmark slightly less volatile
      
      performance.push({
        date: date.toISOString().split('T')[0],
        value: portfolioValue,
        benchmarkValue: benchmarkValue
      });
    }

    // Generate recommendations based on portfolio analysis
    const recommendations = [];
    
    // Check for concentration risk
    const highConcentrationThreshold = 25; // 25%
    allocation.forEach(item => {
      if (item.percentage > highConcentrationThreshold) {
        recommendations.push({
          type: 'rebalance',
          symbol: item.symbol,
          reason: `${item.symbol} represents ${item.percentage.toFixed(1)}% of your portfolio. Consider reducing concentration risk by diversifying.`,
          priority: 'high'
        });
      }
    });

    // Check for underperforming holdings
    holdings.forEach(holding => {
      const pnl = (holding.currentPrice - holding.purchasePrice) / holding.purchasePrice * 100;
      if (pnl < -15) {
        recommendations.push({
          type: 'sell',
          symbol: holding.symbol,
          reason: `${holding.symbol} is down ${Math.abs(pnl).toFixed(1)}%. Consider reviewing your investment thesis or setting a stop-loss.`,
          priority: 'medium'
        });
      } else if (pnl > 20) {
        recommendations.push({
          type: 'hold',
          symbol: holding.symbol,
          reason: `${holding.symbol} is up ${pnl.toFixed(1)}%. Consider taking partial profits or holding for long-term gains.`,
          priority: 'low'
        });
      }
    });

    // Add diversification recommendation if portfolio is too small
    if (holdings.length < 5) {
      recommendations.push({
        type: 'buy',
        symbol: 'DIVERSIFY',
        reason: 'Your portfolio has fewer than 5 holdings. Consider adding more diversified investments to reduce risk.',
        priority: 'medium'
      });
    }

    const metrics = {
      totalValue,
      totalInvestment,
      totalPnL,
      totalPnLPercentage,
      dayChange: totalValue * 0.02 * (Math.random() - 0.5), // Mock day change
      dayChangePercentage: 2 * (Math.random() - 0.5) // Mock day change percentage
    };

    const analysis = {
      metrics,
      allocation,
      performance,
      recommendations
    };

    res.json(analysis);
  } catch (error) {
    console.error('Portfolio analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze portfolio' });
  }
});

app.get('/api/portfolio/benchmark/:symbol', async (req, res) => {
  const { symbol } = req.params;
  
  try {
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    const quote = response.data['Global Quote'];
    if (!quote) {
      return res.status(404).json({ error: `No data found for benchmark: ${symbol}` });
    }

    const benchmarkData = {
      symbol: symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
    };

    res.json(benchmarkData);
  } catch (error) {
    console.error('Benchmark data error:', error);
    res.status(500).json({ error: 'Failed to fetch benchmark data' });
  }
});

app.listen(6123, () => {
  console.log('Server running on port 6123');
});
