import { useDispatch } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { removeHolding, type PortfolioHolding } from '../../features/portfolio/portfolioSlice';

interface HoldingsTableProps {
  holdings: PortfolioHolding[];
}

const HoldingsTable = ({ holdings }: HoldingsTableProps) => {
  const dispatch = useDispatch();

  const handleDelete = (id: string) => {
    dispatch(removeHolding(id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPnL = (holding: PortfolioHolding) => {
    const totalCurrent = holding.currentPrice * holding.shares;
    const totalPurchase = holding.purchasePrice * holding.shares;
    return totalCurrent - totalPurchase;
  };

  const getPnLPercentage = (holding: PortfolioHolding) => {
    const pnl = getPnL(holding);
    const totalPurchase = holding.purchasePrice * holding.shares;
    return (pnl / totalPurchase) * 100;
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600 }}>Symbol</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">Quantity</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">Purchase Price</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">Current Price</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">Market Value</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">P&L</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">P&L %</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {holdings.map((holding) => {
            const pnl = getPnL(holding);
            const pnlPercentage = getPnLPercentage(holding);
            const marketValue = holding.currentPrice * holding.shares;
            const isPositive = pnl >= 0;

            return (
              <TableRow key={holding.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {holding.symbol}
                    </Typography>
                    {holding.type === 'option' && (
                      <Typography variant="caption" color="text.secondary">
                        {holding.optionType} {holding.strike} {holding.expiry}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={holding.type.toUpperCase()}
                    size="small"
                    color={holding.type === 'stock' ? 'primary' : 'secondary'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {holding.shares.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatCurrency(holding.purchasePrice)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatCurrency(holding.currentPrice)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatCurrency(marketValue)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                    {isPositive ? (
                      <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color: isPositive ? 'success.main' : 'error.main',
                        fontWeight: 500
                      }}
                    >
                      {formatCurrency(Math.abs(pnl))}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{
                      color: isPositive ? 'success.main' : 'error.main',
                      fontWeight: 500
                    }}
                  >
                    {formatPercentage(pnlPercentage)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete(holding.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HoldingsTable;
