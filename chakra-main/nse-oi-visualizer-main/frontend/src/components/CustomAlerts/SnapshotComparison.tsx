import { useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';

interface SnapshotComparisonProps {
  open: boolean;
  onClose: () => void;
  snapshot: any;
  currentData: any;
}

const SnapshotComparison = ({ open, onClose, snapshot, currentData }: SnapshotComparisonProps) => {
  const [selectedMetric, setSelectedMetric] = useState('oi');

  const getChangeIndicator = (oldValue: number, newValue: number) => {
    if (!oldValue || !newValue) return <RemoveIcon color="action" />;
    
    const change = ((newValue - oldValue) / oldValue) * 100;
    
    if (change > 5) {
      return <TrendingUpIcon color="success" />;
    } else if (change < -5) {
      return <TrendingDownIcon color="error" />;
    } else {
      return <RemoveIcon color="action" />;
    }
  };

  const getChangeValue = (oldValue: number, newValue: number) => {
    if (!oldValue || !newValue) return 'N/A';
    
    const change = ((newValue - oldValue) / oldValue) * 100;
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getChangeColor = (oldValue: number, newValue: number) => {
    if (!oldValue || !newValue) return 'text.secondary';
    
    const change = ((newValue - oldValue) / oldValue) * 100;
    
    if (change > 5) return 'success.main';
    if (change < -5) return 'error.main';
    return 'text.secondary';
  };

  if (!snapshot || !currentData) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Snapshot Comparison: {snapshot.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comparing {snapshot.timestamp.toLocaleString()} with current data
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total OI Change
                </Typography>
                <Typography variant="h6" color={getChangeColor(
                  snapshot.data?.totalOI || 0,
                  currentData?.totalOI || 0
                )}>
                  {getChangeValue(
                    snapshot.data?.totalOI || 0,
                    currentData?.totalOI || 0
                  )}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Call OI Change
                </Typography>
                <Typography variant="h6" color={getChangeColor(
                  snapshot.data?.callOI || 0,
                  currentData?.callOI || 0
                )}>
                  {getChangeValue(
                    snapshot.data?.callOI || 0,
                    currentData?.callOI || 0
                  )}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Put OI Change
                </Typography>
                <Typography variant="h6" color={getChangeColor(
                  snapshot.data?.putOI || 0,
                  currentData?.putOI || 0
                )}>
                  {getChangeValue(
                    snapshot.data?.putOI || 0,
                    currentData?.putOI || 0
                  )}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Strike-wise Comparison
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Strike</TableCell>
                <TableCell>Option Type</TableCell>
                <TableCell>Snapshot OI</TableCell>
                <TableCell>Current OI</TableCell>
                <TableCell>Change</TableCell>
                <TableCell>Trend</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* This is a simplified example - you would need to map through actual strike data */}
              <TableRow>
                <TableCell>18000</TableCell>
                <TableCell>CE</TableCell>
                <TableCell>{snapshot.data?.strikes?.['18000']?.CE?.oi || 'N/A'}</TableCell>
                <TableCell>{currentData?.strikes?.['18000']?.CE?.oi || 'N/A'}</TableCell>
                <TableCell color={getChangeColor(
                  snapshot.data?.strikes?.['18000']?.CE?.oi || 0,
                  currentData?.strikes?.['18000']?.CE?.oi || 0
                )}>
                  {getChangeValue(
                    snapshot.data?.strikes?.['18000']?.CE?.oi || 0,
                    currentData?.strikes?.['18000']?.CE?.oi || 0
                  )}
                </TableCell>
                <TableCell>
                  {getChangeIndicator(
                    snapshot.data?.strikes?.['18000']?.CE?.oi || 0,
                    currentData?.strikes?.['18000']?.CE?.oi || 0
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>18000</TableCell>
                <TableCell>PE</TableCell>
                <TableCell>{snapshot.data?.strikes?.['18000']?.PE?.oi || 'N/A'}</TableCell>
                <TableCell>{currentData?.strikes?.['18000']?.PE?.oi || 'N/A'}</TableCell>
                <TableCell color={getChangeColor(
                  snapshot.data?.strikes?.['18000']?.PE?.oi || 0,
                  currentData?.strikes?.['18000']?.PE?.oi || 0
                )}>
                  {getChangeValue(
                    snapshot.data?.strikes?.['18000']?.PE?.oi || 0,
                    currentData?.strikes?.['18000']?.PE?.oi || 0
                  )}
                </TableCell>
                <TableCell>
                  {getChangeIndicator(
                    snapshot.data?.strikes?.['18000']?.PE?.oi || 0,
                    currentData?.strikes?.['18000']?.PE?.oi || 0
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> This comparison shows the percentage change in Open Interest (OI) between the saved snapshot and current market data. 
            Green arrows indicate increases, red arrows indicate decreases, and horizontal lines indicate minimal change.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SnapshotComparison;
