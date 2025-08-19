import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { type PortfolioMetrics as PortfolioMetricsType } from '../../features/portfolio/portfolioSlice';

interface PortfolioMetricsProps {
  metrics: PortfolioMetricsType | undefined;
  isLoading: boolean;
}

const PortfolioMetrics = ({ metrics, isLoading }: PortfolioMetricsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = 'primary.main',
    isPositive 
  }: {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string;
    isPositive?: boolean;
  }) => (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: 2, 
            backgroundColor: `${color.replace('.main', '.50')}`,
            mr: 2 
          }}>
            {icon}
          </Box>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        
        {isLoading ? (
          <Skeleton variant="text" width="60%" height={32} />
        ) : (
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            mb: 1,
            color: isPositive !== undefined ? (isPositive ? 'success.main' : 'error.main') : 'text.primary'
          }}>
            {value}
          </Typography>
        )}
        
        {subtitle && !isLoading && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        
        {isLoading && subtitle && (
          <Skeleton variant="text" width="40%" height={20} />
        )}
      </CardContent>
    </Card>
  );

  if (!metrics && !isLoading) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        Portfolio Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Value"
            value={metrics ? formatCurrency(metrics.totalValue) : '$0'}
            subtitle="Current market value"
            icon={<AccountBalanceWalletIcon sx={{ color: 'primary.main' }} />}
            color="primary.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Investment"
            value={metrics ? formatCurrency(metrics.totalInvestment) : '$0'}
            subtitle="Amount invested"
            icon={<ShowChartIcon sx={{ color: 'info.main' }} />}
            color="info.main"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total P&L"
            value={metrics ? formatCurrency(metrics.totalPnL) : '$0'}
            subtitle={metrics ? formatPercentage(metrics.totalPnLPercentage) : '0%'}
            icon={metrics && metrics.totalPnL >= 0 ? 
              <TrendingUpIcon sx={{ color: 'success.main' }} /> : 
              <TrendingDownIcon sx={{ color: 'error.main' }} />
            }
            color={metrics && metrics.totalPnL >= 0 ? 'success.main' : 'error.main'}
            isPositive={metrics ? metrics.totalPnL >= 0 : undefined}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Day Change"
            value={metrics ? formatCurrency(metrics.dayChange) : '$0'}
            subtitle={metrics ? formatPercentage(metrics.dayChangePercentage) : '0%'}
            icon={metrics && metrics.dayChange >= 0 ? 
              <TrendingUpIcon sx={{ color: 'success.main' }} /> : 
              <TrendingDownIcon sx={{ color: 'error.main' }} />
            }
            color={metrics && metrics.dayChange >= 0 ? 'success.main' : 'error.main'}
            isPositive={metrics ? metrics.dayChange >= 0 : undefined}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PortfolioMetrics;
