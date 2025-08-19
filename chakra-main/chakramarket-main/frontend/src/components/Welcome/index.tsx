import { Box, Container, Typography, Grid, Card, CardContent, Button, Paper, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Welcome = () => {
  const navigate = useNavigate();

  const capabilities = [
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Portfolio Manager',
      description: 'Track, analyze, and optimize your investment portfolio with real-time data and AI-powered recommendations.',
      color: 'success.main'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Market Positions Viewer',
      description: 'Track where traders are placing bets with detailed call/put contract activity.',
      color: 'primary.main'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Trade Planner',
      description: 'Simulate and test option strategies before committing real money.',
      color: 'info.main'
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Custom Alerts',
      description: 'Get notified when market conditions match your criteria.',
      color: 'warning.main'
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Market Sentiment Insights',
      description: 'Instantly see if the market is leaning bullish, bearish, or neutral.',
      color: 'secondary.main'
    },
    {
      icon: <DarkModeIcon sx={{ fontSize: 40, color: 'text.secondary' }} />,
      title: 'Dark / Light Mode',
      description: 'Switch between themes for a comfortable experience.',
      color: 'text.secondary'
    }
  ];

  const quickStartSteps = [
    {
      step: '1',
      title: 'Build Your Portfolio',
      description: 'Start by adding your stocks and options to the Portfolio Manager to track performance.'
    },
    {
      step: '2',
      title: 'Choose Your Index',
      description: 'Select NIFTY, BANKNIFTY, FINNIFTY, or MIDCPNIFTY for market analysis.'
    },
    {
      step: '3',
      title: 'Pick an Expiry Date',
      description: 'Use the expiry dropdown to view contracts for weekly or monthly expiries.'
    },
    {
      step: '4',
      title: 'Set Your Strike Range',
      description: 'Adjust how many strike prices above and below ATM you want to analyze.'
    },
    {
      step: '5',
      title: 'Read Market Sentiment',
      description: 'View the automatic sentiment card to understand overall trends.'
    },
    {
      step: '6',
      title: 'Plan Your Trade',
      description: 'Open the Trade Planner to test combinations of options, calculate risk, and fine-tune your strategy.'
    }
  ];

  const benefits = [
    'Designed for beginners and professionals alike',
    'Focuses on clarity, speed, and ease of use',
    'Helps you make informed trading decisions with confidence'
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: '64px' }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" sx={{ 
          fontWeight: 700, 
          mb: 2,
          background: 'linear-gradient(45deg, #6366F1, #8B5CF6)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Welcome to ChakraMarkets
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
          Simplifying Options Market Analysis
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: '900px', mx: 'auto', fontSize: '18px', lineHeight: 1.6 }}>
          ChakraMarkets helps you understand and trade options smarter with clear visuals, real-time data, and beginner-friendly tools. 
          Whether you are just starting out or refining your strategies, our platform makes complex market data easy to grasp.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={() => navigate('/portfolio-manager')}
          sx={{ 
            px: 4, 
            py: 1.5, 
            fontSize: '18px',
            borderRadius: 3,
            boxShadow: 3
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* Capabilities Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" sx={{ 
          fontWeight: 600, 
          mb: 4, 
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          🚀 Capabilities
        </Typography>
        <Grid container spacing={3}>
          {capabilities.map((capability, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {capability.icon}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: capability.color
                  }}>
                    {capability.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {capability.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Quick Start Tutorial */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" sx={{ 
          fontWeight: 600, 
          mb: 4, 
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          📖 Quick Start Tutorial
        </Typography>
        <Paper elevation={0} sx={{ p: 4, border: 1, borderColor: 'divider', borderRadius: 3 }}>
          <Grid container spacing={3}>
            {quickStartSteps.map((step, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Chip
                    label={step.step}
                    color="primary"
                    sx={{ 
                      fontWeight: 600,
                      minWidth: '40px',
                      height: '40px'
                    }}
                  />
                  <Box>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      {/* Why ChakraMarkets Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" sx={{ 
          fontWeight: 600, 
          mb: 4, 
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          ✅ Why ChakraMarkets?
        </Typography>
        <Grid container spacing={3}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card elevation={1} sx={{ 
                height: '100%',
                border: 1,
                borderColor: 'success.light',
                backgroundColor: 'success.50'
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                    {benefit}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Paper elevation={0} sx={{ 
          p: 4, 
          border: 1, 
          borderColor: 'primary.light',
          borderRadius: 3,
          backgroundColor: 'primary.50'
        }}>
          <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
            Ready to Start Trading Smarter?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join thousands of traders who are already using ChakraMarkets to make better decisions.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/portfolio-manager')}
            sx={{ 
              px: 4, 
              py: 1.5, 
              fontSize: '18px',
              borderRadius: 3,
              boxShadow: 3
            }}
          >
            Start Managing Portfolio
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Welcome;
