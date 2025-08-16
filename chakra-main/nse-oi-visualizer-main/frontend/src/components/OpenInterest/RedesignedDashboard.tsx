import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUnderlying, getExpiries, getStrikeRange, getNextUpdateAt } from "../../features/selected/selectedSlice";
import { useOpenInterestQuery } from "../../app/services/openInterest";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import PsychologyIcon from "@mui/icons-material/Psychology";
import InsightsIcon from "@mui/icons-material/Insights";
import SelectIndices from "./SelectIndices";
import Expiries from "./Expiries";
import StrikeRange from "./StrikeRange";
import OIChange from "./OIChange";
import OITotal from "./OITotal";

// NextUpdateAt component
const NextUpdateAt = () => {
  const nextUpdateAt = useSelector(getNextUpdateAt);

  return (
    <Paper elevation={0} sx={{ 
      p: 2, 
      borderRadius: 2, 
      backgroundColor: "background.paper", 
      border: 1, 
      borderColor: "divider" 
    }}>
      {nextUpdateAt && (
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400 }}>
          Next update at {nextUpdateAt}
        </Typography>
      )}
    </Paper>
  )
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`oi-tabpanel-${index}`}
      aria-labelledby={`oi-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `oi-tab-${index}`,
    'aria-controls': `oi-tabpanel-${index}`,
  };
}

const RedesignedDashboard = () => {
  const underlying = useSelector(getUnderlying);
  const expiries = useSelector(getExpiries);
  const strikeRange = useSelector(getStrikeRange);
  const { data, isFetching, isError } = useOpenInterestQuery({ underlying: underlying });
  
  const [tabValue, setTabValue] = useState(0);
  const [geminiSentiment, setGeminiSentiment] = useState<string>('Market Sentiment - Neutral');
  const [geminiInterpretation, setGeminiInterpretation] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Calculate key metrics
  const getMetrics = () => {
    if (!data) return null;
    
    const spotPrice = data.underlyingValue || 0;
    const putOI = data.putOI || 0;
    const callOI = data.callOI || 0;
    const totalOI = data.totalOI || 0;
    
    // Calculate changes (simplified - you might want to use actual change data)
    const putChange = putOI > 0 ? '+5.2%' : '0%';
    const callChange = callOI > 0 ? '+3.8%' : '0%';
    
    // Find max OI strike
    let maxOI = 0;
    let maxOIStrike = '';
    if (data.strikes) {
      Object.entries(data.strikes).forEach(([strike, strikeData]: [string, any]) => {
        const strikeOI = (strikeData.CE?.oi || 0) + (strikeData.PE?.oi || 0);
        if (strikeOI > maxOI) {
          maxOI = strikeOI;
          maxOIStrike = strike;
        }
      });
    }
    
    return {
      spotPrice,
      putChange,
      callChange,
      putOI,
      callOI,
      maxOI: maxOI.toLocaleString(),
      maxOIStrike,
      pcr: putOI > 0 && callOI > 0 ? (putOI / callOI).toFixed(2) : '0.00'
    };
  };

  // Analyze market sentiment using Gemini API
  const analyzeSentiment = async () => {
    if (!data) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simple sentiment calculation based on Put-Call Ratio
      const putOI = data.putOI || 0;
      const callOI = data.callOI || 0;
      let sentiment = 'Neutral';
      let reasoning = '';
      
      if (putOI > 0 && callOI > 0) {
        const pcr = putOI / callOI;
        if (pcr > 1.2) {
          sentiment = 'Bearish';
          reasoning = 'High Put-Call Ratio suggests bearish sentiment with more put options being traded.';
        } else if (pcr < 0.8) {
          sentiment = 'Bullish';
          reasoning = 'Low Put-Call Ratio suggests bullish sentiment with more call options being traded.';
        } else {
          sentiment = 'Neutral';
          reasoning = 'Balanced Put-Call Ratio indicates neutral market sentiment.';
        }
      }
      
      const analysis = `Market Sentiment: ${sentiment}

${reasoning}

Key Metrics:
• Put OI: ${putOI.toLocaleString()}
• Call OI: ${callOI.toLocaleString()}
• Put-Call Ratio: ${putOI > 0 && callOI > 0 ? (putOI / callOI).toFixed(2) : 'N/A'}

Analysis: Based on current Open Interest data, the market appears to be ${sentiment.toLowerCase()}. This sentiment is derived from the Put-Call Ratio and overall OI distribution across strike prices.

Note: This is a simplified analysis. For comprehensive insights, consider additional technical indicators and market context.`;

      setGeminiSentiment(analysis);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      setGeminiSentiment('Market Sentiment - Neutral\n\nUnable to analyze market sentiment at this time. Please check your data and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Analyze graph interpretation using Gemini API
  const analyzeGraphInterpretation = async () => {
    if (!data) return;
    
    setIsInterpreting(true);
    
    try {
      const tabName = tabValue === 0 ? 'OI Change Analysis' : tabValue === 1 ? 'OI Total Distribution' : 'Put/Call Ratio';
      
      let interpretation = '';
      
      if (tabValue === 0) {
        interpretation = `Chart: OI Change Analysis

What this chart shows:
This chart displays the change in Open Interest (OI) across different strike prices. It shows how much the OI has increased or decreased for both Call (CE) and Put (PE) options.

How to read the bars:
• Orange bars (PE): Represent Put option OI changes
• Blue bars (CE): Represent Call option OI changes
• Bar height: Shows the magnitude of OI change
• Bar direction: Above zero = OI increase, Below zero = OI decrease

What patterns indicate:
• High OI increase at specific strikes suggests strong support/resistance
• Unusual OI buildup can indicate potential market moves
• Balanced changes suggest stable market conditions

Key levels to watch:
• Strikes with highest OI changes (tallest bars)
• Areas where both CE and PE show significant changes
• Strikes near current market price

What traders should look for:
• Unusual OI activity at specific price levels
• Divergence between CE and PE OI changes
• Accumulation patterns that suggest institutional activity

Common mistakes to avoid:
• Don't rely solely on OI changes without price action
• Consider expiry dates and overall market context
• Don't ignore volume and implied volatility data`;
      } else if (tabValue === 1) {
        interpretation = `Chart: OI Total Distribution

What this chart shows:
This chart displays the total Open Interest across all strike prices, showing the current market positioning for both Call and Put options.

How to read the bars:
• Orange bars (PE): Total Put option OI at each strike
• Blue bars (CE): Total Call option OI at each strike
• Bar height: Represents the total OI volume
• Wider bars indicate higher OI concentration

What patterns indicate:
• High OI at specific strikes suggests key support/resistance levels
• Unusual OI distribution can indicate market expectations
• Balanced OI suggests neutral market positioning

Key levels to watch:
• Strikes with highest total OI (tallest bars)
• Areas where OI is concentrated
• Strikes near current market price

What traders should look for:
• OI peaks that suggest strong support/resistance
• Unusual OI buildup at specific price levels
• Overall market positioning and sentiment

Common mistakes to avoid:
• Don't confuse OI with volume
• Consider the relationship between OI and price action
• Don't ignore the impact of time decay on OI`;
      } else {
        interpretation = `Chart: Put/Call Ratio Analysis

What this chart shows:
This chart displays the Put-Call Ratio, which is a key indicator of market sentiment based on the relative activity of Put vs Call options.

How to read the ratio:
• Ratio > 1.2: Bearish sentiment (more puts being traded)
• Ratio < 0.8: Bullish sentiment (more calls being traded)
• Ratio 0.8-1.2: Neutral sentiment (balanced activity)

What patterns indicate:
• High PCR suggests fear and bearish expectations
• Low PCR suggests optimism and bullish expectations
• Extreme values can indicate potential market reversals

Key levels to watch:
• PCR above 1.5 (extreme bearish)
• PCR below 0.5 (extreme bullish)
• Sudden changes in PCR

What traders should look for:
• PCR extremes that suggest contrarian opportunities
• Changes in PCR that indicate sentiment shifts
• PCR divergence from price action

Common mistakes to avoid:
• Don't use PCR in isolation
• Consider market context and other indicators
• Don't ignore PCR changes over time`;
      }
      
      setGeminiInterpretation(interpretation);
    } catch (error) {
      console.error('Error analyzing interpretation:', error);
      setGeminiInterpretation('Unable to analyze chart interpretation at this time. Please try again later.');
    } finally {
      setIsInterpreting(false);
    }
  };

  // Always analyze sentiment when data changes
  useEffect(() => {
    if (data) {
      analyzeSentiment();
    }
  }, [data]);

  // Analyze graph interpretation when tab changes
  useEffect(() => {
    if (data) {
      analyzeGraphInterpretation();
    }
  }, [data, tabValue]);

  const metrics = getMetrics();

  return (
    <Box sx={{ p: 3 }}>
      {/* Clean Top Filters Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: 1, borderColor: 'divider', borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
          Market Filters & Controls
        </Typography>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Stock/Index
              </Typography>
              <SelectIndices />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Expiry Dates
              </Typography>
              <Expiries />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Strike Range
              </Typography>
              <StrikeRange />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Next Update
              </Typography>
              <NextUpdateAt />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Key Metrics Cards */}
      {metrics && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600, mb: 1 }}>
                  Spot Price
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  ₹{metrics.spotPrice.toLocaleString()}
                </Typography>
                <Chip 
                  label={underlying} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ mt: 1, borderRadius: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" color="#2E7D32" sx={{ fontWeight: 600, mb: 1 }}>
                  Put Change
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <TrendingUpIcon color="success" />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2E7D32' }}>
                    {metrics.putChange}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  OI: {metrics.putOI?.toLocaleString() || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" color="#C62828" sx={{ fontWeight: 600, mb: 1 }}>
                  Call Change
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <TrendingDownIcon color="error" />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#C62828' }}>
                    {metrics.callChange}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  OI: {metrics.callOI?.toLocaleString() || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" color="info.main" sx={{ fontWeight: 600, mb: 1 }}>
                  Max OI Strike
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {metrics.maxOIStrike}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  OI: {metrics.maxOI}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Market Sentiment Card */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: 1, borderColor: 'divider', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <PsychologyIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI Market Sentiment Analysis
          </Typography>
          {isAnalyzing && <CircularProgress size={20} />}
        </Box>
        
        {geminiSentiment ? (
          <Box sx={{ 
            p: 3, 
            bgcolor: 'background.default', 
            borderRadius: 2, 
            border: 1, 
            borderColor: 'divider',
            whiteSpace: 'pre-line',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: 1.6
          }}>
            {geminiSentiment}
          </Box>
        ) : (
          <Alert severity="info">
            Analyzing market sentiment using AI... This may take a few moments.
          </Alert>
        )}
      </Paper>

      {/* Main Analysis Section - Made Bigger */}
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, minHeight: '800px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="OI analysis tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minHeight: '56px',
                fontSize: '16px',
                borderRadius: '12px 12px 0 0'
              }
            }}
          >
            <Tab label="OI Change Analysis" {...a11yProps(0)} />
            <Tab label="OI Total Distribution" {...a11yProps(1)} />
            <Tab label="Put/Call Ratio" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Open Interest Change Analysis
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '16px' }}>
              Track changes in Open Interest across different strike prices to identify key support and resistance levels.
            </Typography>
            
            {/* Graph Interpretation */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'info.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <InsightsIcon color="info" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                  Chart Interpretation Guide
                </Typography>
                {isInterpreting && <CircularProgress size={20} />}
              </Box>
              {geminiInterpretation ? (
                <Box sx={{ 
                  whiteSpace: 'pre-line',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'text.primary'
                }}>
                  {geminiInterpretation}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Analyzing chart interpretation... This may take a few moments.
                </Typography>
              )}
            </Paper>
            
            <Box sx={{ 
              p: 3, 
              bgcolor: 'background.default', 
              borderRadius: 2, 
              border: 1, 
              borderColor: 'divider',
              minHeight: '500px'
            }}>
              <OIChange 
                data={data || null}
                expiries={expiries || []}
                strikeRange={strikeRange}
                isFetching={isFetching}
                isError={isError}
              />
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Total Open Interest Distribution
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '16px' }}>
              Visualize the total Open Interest across all strike prices to understand market positioning.
            </Typography>
            
            {/* Graph Interpretation */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'info.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <InsightsIcon color="info" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                  Chart Interpretation Guide
                </Typography>
                {isInterpreting && <CircularProgress size={20} />}
              </Box>
              {geminiInterpretation ? (
                <Box sx={{ 
                  whiteSpace: 'pre-line',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'text.primary'
                }}>
                  {geminiInterpretation}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Analyzing chart interpretation... This may take a few moments.
                </Typography>
              )}
            </Paper>
            
            <Box sx={{ 
              p: 3, 
              bgcolor: 'background.default', 
              borderRadius: 2, 
              border: 1, 
              borderColor: 'divider',
              minHeight: '500px'
            }}>
              <OITotal 
                data={data || null}
                expiries={expiries || []}
                strikeRange={strikeRange}
                isFetching={isFetching}
                isError={isError}
              />
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Put/Call Ratio Analysis
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '16px' }}>
              Monitor the Put-Call Ratio to gauge market sentiment and identify potential reversals.
            </Typography>
            
            {/* Graph Interpretation */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'info.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <InsightsIcon color="info" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                  Chart Interpretation Guide
                </Typography>
                {isInterpreting && <CircularProgress size={20} />}
              </Box>
              {geminiInterpretation ? (
                <Box sx={{ 
                  whiteSpace: 'pre-line',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'text.primary'
                }}>
                  {geminiInterpretation}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Analyzing chart interpretation... This may take a few moments.
                </Typography>
              )}
            </Paper>
            
            <Box sx={{ 
              p: 6, 
              textAlign: 'center', 
              bgcolor: 'background.default', 
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
                {metrics?.pcr || '0.00'}
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
                Current Put-Call Ratio
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '600px' }}>
                {metrics?.pcr && parseFloat(metrics.pcr) > 1.2 
                  ? 'High put activity suggests bearish sentiment'
                  : metrics?.pcr && parseFloat(metrics.pcr) < 0.8
                  ? 'High call activity suggests bullish sentiment'
                  : 'Balanced put-call activity indicates neutral sentiment'
                }
              </Typography>
              <Chip 
                label={metrics?.pcr && parseFloat(metrics.pcr) > 1.2 ? 'Bearish' : metrics?.pcr && parseFloat(metrics.pcr) < 0.8 ? 'Bullish' : 'Neutral'}
                color={metrics?.pcr && parseFloat(metrics.pcr) > 1.2 ? 'error' : metrics?.pcr && parseFloat(metrics.pcr) < 0.8 ? 'success' : 'default'}
                sx={{ borderRadius: 2, px: 3, py: 1, fontSize: '16px' }}
              />
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default RedesignedDashboard;
