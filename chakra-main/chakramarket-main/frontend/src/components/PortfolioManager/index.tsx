import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import RecommendIcon from '@mui/icons-material/Recommend';
import RefreshIcon from '@mui/icons-material/Refresh';
import { 
  getHoldings, 
  getMetrics, 
  getBenchmark,
  getPortfolioLoading,
  getPortfolioError,
  type PortfolioHolding 
} from '../../features/portfolio/portfolioSlice';
import { useAnalyzePortfolioQuery } from '../../app/services/portfolio';
import { useRealTimePrices } from '../../hooks/useRealTimePrices';
import AddHoldingForm from './AddHoldingForm';
import HoldingsTable from './HoldingsTable';
import PortfolioCharts from './PortfolioCharts';
import PortfolioMetrics from './PortfolioMetrics';
import Recommendations from './Recommendations';

const PortfolioManager = () => {
  const dispatch = useDispatch();
  const holdings = useSelector(getHoldings);
  const metrics = useSelector(getMetrics);
  const benchmark = useSelector(getBenchmark);
  const isLoading = useSelector(getPortfolioLoading);
  const error = useSelector(getPortfolioError);
  
  const [activeTab, setActiveTab] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  // Real-time price updates
  const { refreshPrices } = useRealTimePrices();

  // Analyze portfolio when holdings change
  const { 
    data: portfolioAnalysis, 
    isLoading: isAnalyzing,
    error: analysisError 
  } = useAnalyzePortfolioQuery(
    { holdings, benchmark },
    { skip: holdings.length === 0 }
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                  Your Holdings
                </Typography>
                {holdings.length > 0 && (
                  <Tooltip title="Refresh prices">
                    <IconButton onClick={refreshPrices} size="small">
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowAddForm(true)}
                sx={{ borderRadius: 2 }}
              >
                Add Holding
              </Button>
            </Box>
            
            {holdings.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', border: 1, borderColor: 'divider' }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No holdings added yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start building your portfolio by adding stocks or options
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddForm(true)}
                >
                  Add Your First Holding
                </Button>
              </Paper>
            ) : (
              <HoldingsTable holdings={holdings} />
            )}
          </Box>
        );
      case 1:
        return <PortfolioCharts analysis={portfolioAnalysis} />;
      case 2:
        return <Recommendations analysis={portfolioAnalysis} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: '64px' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ 
          fontWeight: 700, 
          mb: 2,
          background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Portfolio Manager
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Track, analyze, and optimize your investment portfolio with real-time updates every 3 minutes
        </Typography>
      </Box>

      {/* Error Alert */}
      {(error || analysisError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Failed to analyze portfolio'}
        </Alert>
      )}

      {/* Portfolio Metrics */}
      {holdings.length > 0 && (
        <PortfolioMetrics 
          metrics={portfolioAnalysis?.metrics} 
          isLoading={isAnalyzing} 
        />
      )}

      {/* Main Content */}
      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 3 }}>
            <Tab 
              icon={<TrendingUpIcon />} 
              label="Holdings" 
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab 
              icon={<PieChartIcon />} 
              label="Analytics" 
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 500 }}
              disabled={holdings.length === 0}
            />
            <Tab 
              icon={<RecommendIcon />} 
              label="Recommendations" 
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 500 }}
              disabled={holdings.length === 0}
            />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {isAnalyzing && holdings.length > 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            renderTabContent()
          )}
        </Box>
      </Paper>

      {/* Add Holding Form Dialog */}
      <AddHoldingForm 
        open={showAddForm} 
        onClose={() => setShowAddForm(false)} 
      />
    </Container>
  );
};

export default PortfolioManager;
