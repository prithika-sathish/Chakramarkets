import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import HoldIcon from '@mui/icons-material/PanTool';
import BalanceIcon from '@mui/icons-material/Balance';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { type PortfolioAnalysis } from '../../app/services/portfolio';

interface RecommendationsProps {
  analysis: PortfolioAnalysis | undefined;
}

const Recommendations = ({ analysis }: RecommendationsProps) => {
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <TrendingUpIcon sx={{ color: 'success.main' }} />;
      case 'sell':
        return <TrendingDownIcon sx={{ color: 'error.main' }} />;
      case 'hold':
        return <HoldIcon sx={{ color: 'info.main' }} />;
      case 'rebalance':
        return <BalanceIcon sx={{ color: 'warning.main' }} />;
      default:
        return <InfoIcon sx={{ color: 'primary.main' }} />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'success';
      case 'sell':
        return 'error';
      case 'hold':
        return 'info';
      case 'rebalance':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <WarningIcon sx={{ color: 'error.main', fontSize: 16 }} />;
      case 'medium':
        return <InfoIcon sx={{ color: 'warning.main', fontSize: 16 }} />;
      case 'low':
        return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />;
      default:
        return <InfoIcon sx={{ color: 'info.main', fontSize: 16 }} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };

  if (!analysis?.recommendations || analysis.recommendations.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No recommendations available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add more holdings to get personalized investment recommendations
        </Typography>
      </Paper>
    );
  }

  const highPriorityRecommendations = analysis.recommendations.filter(r => r.priority === 'high');
  const mediumPriorityRecommendations = analysis.recommendations.filter(r => r.priority === 'medium');
  const lowPriorityRecommendations = analysis.recommendations.filter(r => r.priority === 'low');

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        Investment Recommendations
      </Typography>

      {highPriorityRecommendations.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            High Priority Actions Required
          </Typography>
          <Typography variant="body2">
            You have {highPriorityRecommendations.length} high-priority recommendation(s) that require immediate attention.
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {analysis.recommendations.map((recommendation, index) => (
          <Card 
            key={index} 
            elevation={0} 
            sx={{ 
              border: 1, 
              borderColor: recommendation.priority === 'high' ? 'error.light' : 'divider',
              backgroundColor: recommendation.priority === 'high' ? 'error.50' : 'background.paper'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ mt: 0.5 }}>
                  {getRecommendationIcon(recommendation.type)}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      {recommendation.symbol}
                    </Typography>
                    <Chip
                      label={recommendation.type.toUpperCase()}
                      size="small"
                      color={getRecommendationColor(recommendation.type) as any}
                      variant="outlined"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getPriorityIcon(recommendation.priority)}
                      <Chip
                        label={`${recommendation.priority.toUpperCase()} PRIORITY`}
                        size="small"
                        color={getPriorityColor(recommendation.priority) as any}
                        variant="filled"
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
                    {recommendation.reason}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Summary by Priority */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
          Recommendation Summary
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {highPriorityRecommendations.length > 0 && (
            <Chip
              icon={<WarningIcon />}
              label={`${highPriorityRecommendations.length} High Priority`}
              color="error"
              variant="filled"
            />
          )}
          {mediumPriorityRecommendations.length > 0 && (
            <Chip
              icon={<InfoIcon />}
              label={`${mediumPriorityRecommendations.length} Medium Priority`}
              color="warning"
              variant="filled"
            />
          )}
          {lowPriorityRecommendations.length > 0 && (
            <Chip
              icon={<CheckCircleIcon />}
              label={`${lowPriorityRecommendations.length} Low Priority`}
              color="success"
              variant="filled"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Recommendations;
