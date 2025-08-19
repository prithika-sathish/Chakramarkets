import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { type PortfolioAnalysis } from '../../app/services/portfolio';

interface PortfolioChartsProps {
  analysis: PortfolioAnalysis | undefined;
}

const PortfolioCharts = ({ analysis }: PortfolioChartsProps) => {
  if (!analysis) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No data available for charts
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add some holdings to see portfolio analytics
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        Portfolio Analytics
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                Portfolio Allocation
              </Typography>
              {analysis.allocation && analysis.allocation.length > 0 ? (
                <List>
                  {analysis.allocation.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {item.symbol}
                            </Typography>
                            <Chip
                              label={`${item.percentage.toFixed(1)}%`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={`Value: $${item.value.toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No allocation data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                Performance Summary
              </Typography>
              {analysis.performance && analysis.performance.length > 0 ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Last 30 days performance data
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Latest Portfolio Value:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        ${analysis.performance[analysis.performance.length - 1]?.value.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Latest Benchmark Value:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        ${analysis.performance[analysis.performance.length - 1]?.benchmarkValue.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Data Points:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {analysis.performance.length} days
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No performance data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Note: Interactive charts with Chart.js will be available once the chart dependencies are properly configured.
        </Typography>
      </Box>
    </Box>
  );
};

export default PortfolioCharts;
