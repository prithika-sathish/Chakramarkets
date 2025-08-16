import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUnderlying } from "../../features/selected/selectedSlice";
import { useOpenInterestQuery } from "../../app/services/openInterest";
import { useNotifications } from "../../hooks/useNotifications";
import SnapshotComparison from "./SnapshotComparison";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WatchlistIcon from "@mui/icons-material/Bookmark";
import Alert from "@mui/material/Alert";
import InfoIcon from "@mui/icons-material/Info";
import HelpIcon from "@mui/icons-material/Help";

interface Snapshot {
  id: string;
  name: string;
  timestamp: Date;
  data: any;
}

const CustomAlerts = () => {
  const underlying = useSelector(getUnderlying);
  const { data } = useOpenInterestQuery({ underlying: underlying });
  const { alerts, addAlert, updateAlert, removeAlert, toggleAlert } = useNotifications();
  
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    strike: '',
    optionType: 'CE' as 'CE' | 'PE',
    alertType: 'OI_INCREASE' as any,
    threshold: 0,
    percentage: 10
  });

  const [snapshotName, setSnapshotName] = useState('');
  const [comparisonDialog, setComparisonDialog] = useState<{ open: boolean; snapshot: Snapshot | null }>({
    open: false,
    snapshot: null
  });

  // Load snapshots from localStorage on component mount
  useEffect(() => {
    const savedSnapshots = localStorage.getItem('chakramarkets-snapshots');
    if (savedSnapshots) {
      setSnapshots(JSON.parse(savedSnapshots));
    }
  }, []);

  // Save snapshots to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chakramarkets-snapshots', JSON.stringify(snapshots));
  }, [snapshots]);

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const handleAddAlert = () => {
    if (!newAlert.symbol || !newAlert.strike) return;
    
    addAlert({
      ...newAlert,
      isActive: true
    });
    
    setNewAlert({
      symbol: '',
      strike: '',
      optionType: 'CE',
      alertType: 'OI_INCREASE',
      threshold: 0,
      percentage: 10
    });
    setShowAddAlert(false);
  };

  const handleEditAlert = (alert: any) => {
    setEditingAlert(alert);
    setNewAlert({
      symbol: alert.symbol,
      strike: alert.strike,
      optionType: alert.optionType,
      alertType: alert.alertType,
      threshold: alert.threshold,
      percentage: alert.percentage
    });
    setShowAddAlert(true);
  };

  const handleUpdateAlert = () => {
    if (!editingAlert) return;
    
    updateAlert(editingAlert.id, newAlert);
    setEditingAlert(null);
    setShowAddAlert(false);
    setNewAlert({
      symbol: '',
      strike: '',
      optionType: 'CE',
      alertType: 'OI_INCREASE',
      threshold: 0,
      percentage: 10
    });
  };

  const createSnapshot = () => {
    if (!snapshotName.trim()) return;
    
    const snapshot: Snapshot = {
      id: Date.now().toString(),
      name: snapshotName,
      timestamp: new Date(),
      data: data
    };
    
    setSnapshots([...snapshots, snapshot]);
    setSnapshotName('');
  };

  const deleteSnapshot = (id: string) => {
    setSnapshots(snapshots.filter(snapshot => snapshot.id !== id));
  };

  const openComparison = (snapshot: Snapshot) => {
    setComparisonDialog({ open: true, snapshot });
  };

  const closeComparison = () => {
    setComparisonDialog({ open: false, snapshot: null });
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'OI_INCREASE': return 'OI Increase';
      case 'OI_DECREASE': return 'OI Decrease';
      case 'PRICE_ABOVE': return 'Price Above';
      case 'PRICE_BELOW': return 'Price Below';
      default: return type;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Custom Alerts & Watchlist
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Stay informed about market movements that matter to you
        </Typography>
      </Box>

      {/* Notification Permission Alert */}
      {notificationPermission === 'default' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Enable browser notifications to receive real-time alerts about your watchlist.
          <Button
            size="small"
            onClick={requestNotificationPermission}
            sx={{ ml: 2, borderRadius: '20px', px: 2, py: 0.5, textTransform: 'none', fontWeight: 500 }}
          >
            Enable Notifications
          </Button>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Market Sentiment Card */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <TrendingUpIcon color="success" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Market Sentiment
              </Typography>
              <InfoIcon color="action" sx={{ ml: 'auto' }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center', minWidth: '200px' }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  BULLISH
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on OI patterns and Put-Call ratio
                </Typography>
              </Box>
              <Box sx={{ flex: 1, height: '4px', bgcolor: 'success.main', borderRadius: 2, minWidth: '100px' }} />
              <Box sx={{ textAlign: 'center', minWidth: '200px' }}>
                <Typography variant="h6" color="text.secondary">
                  Put-Call Ratio: 0.85
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  OI Trend: Increasing
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Alerts Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon />
                Price & OI Alerts
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowAddAlert(true)}
                size="small"
                sx={{ borderRadius: '20px', px: 2, py: 0.5, textTransform: 'none', fontWeight: 500 }}
              >
                Add Alert
              </Button>
            </Box>

            {/* Help Text */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'info.50', borderRadius: 1, border: 1, borderColor: 'info.light' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <HelpIcon color="info" fontSize="small" />
                <Typography variant="subtitle2" color="info.main" sx={{ fontWeight: 600 }}>
                  How to Set Alerts
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Set alerts to get notified when specific market conditions are met. For example, 
                "Notify me if 18000CE OI increases by 10%" will alert you when Call option OI at 
                strike 18000 rises by the specified percentage.
              </Typography>
            </Box>

            {showAddAlert && (
              <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Symbol"
                      value={newAlert.symbol}
                      onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                      size="small"
                      placeholder="e.g., NIFTY"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Strike Price"
                      value={newAlert.strike}
                      onChange={(e) => setNewAlert({ ...newAlert, strike: e.target.value })}
                      size="small"
                      placeholder="e.g., 18000"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Option Type</InputLabel>
                      <Select
                        value={newAlert.optionType}
                        label="Option Type"
                        onChange={(e) => setNewAlert({ ...newAlert, optionType: e.target.value as 'CE' | 'PE' })}
                      >
                        <MenuItem value="CE">Call (CE)</MenuItem>
                        <MenuItem value="PE">Put (PE)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Alert Type</InputLabel>
                      <Select
                        value={newAlert.alertType}
                        label="Alert Type"
                        onChange={(e) => setNewAlert({ ...newAlert, alertType: e.target.value })}
                      >
                        <MenuItem value="OI_INCREASE">OI Increase</MenuItem>
                        <MenuItem value="OI_DECREASE">OI Decrease</MenuItem>
                        <MenuItem value="PRICE_ABOVE">Price Above</MenuItem>
                        <MenuItem value="PRICE_BELOW">Price Below</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Threshold"
                      type="number"
                      value={newAlert.threshold}
                      onChange={(e) => setNewAlert({ ...newAlert, threshold: Number(e.target.value) })}
                      size="small"
                      placeholder="e.g., 100"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Percentage"
                      type="number"
                      value={newAlert.percentage}
                      onChange={(e) => setNewAlert({ ...newAlert, percentage: Number(e.target.value) })}
                      size="small"
                      placeholder="e.g., 10"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        onClick={editingAlert ? handleUpdateAlert : handleAddAlert}
                        size="small"
                        sx={{ borderRadius: '20px', px: 3, py: 0.5, textTransform: 'none', fontWeight: 500 }}
                      >
                        {editingAlert ? 'Update Alert' : 'Add Alert'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowAddAlert(false);
                          setEditingAlert(null);
                          setNewAlert({
                            symbol: '',
                            strike: '',
                            optionType: 'CE',
                            alertType: 'OI_INCREASE',
                            threshold: 0,
                            percentage: 10
                          });
                        }}
                        size="small"
                        sx={{ borderRadius: '20px', px: 3, py: 0.5, textTransform: 'none', fontWeight: 500 }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {alerts.map((alert) => (
                <Card key={alert.id} variant="outlined">
                  <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {alert.symbol} {alert.strike}{alert.optionType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getAlertTypeLabel(alert.alertType)} by {alert.percentage}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={alert.isActive}
                              onChange={() => toggleAlert(alert.id)}
                              size="small"
                            />
                          }
                          label=""
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleEditAlert(alert)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removeAlert(alert.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              {alerts.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No alerts set. Create your first alert to get notified about important market movements.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Snapshots Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WatchlistIcon />
                Snapshots & Comparison
              </Typography>
            </Box>

            {/* Help Text */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'success.50', borderRadius: 1, border: 1, borderColor: 'success.light' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <HelpIcon color="success" fontSize="small" />
                <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 600 }}>
                  Save Market Snapshots
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Save snapshots of market data at different times to compare and analyze changes. 
                Perfect for comparing morning vs evening data or today vs yesterday.
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Snapshot Name"
                    value={snapshotName}
                    onChange={(e) => setSnapshotName(e.target.value)}
                    placeholder="e.g., Morning 9:30 AM, Yesterday Close"
                    size="small"
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={createSnapshot}
                    disabled={!snapshotName.trim()}
                    size="small"
                    sx={{ borderRadius: '20px', py: 0.5, textTransform: 'none', fontWeight: 500 }}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {snapshots.map((snapshot) => (
                <Card key={snapshot.id} variant="outlined">
                  <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {snapshot.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {snapshot.timestamp.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => openComparison(snapshot)}
                          sx={{ borderRadius: '20px', px: 2, py: 0.5, textTransform: 'none', fontWeight: 500 }}
                        >
                          Compare
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => deleteSnapshot(snapshot.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              {snapshots.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No snapshots saved. Save snapshots to compare market data across different time periods.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Snapshot Comparison Dialog */}
      {comparisonDialog.snapshot && (
        <SnapshotComparison
          open={comparisonDialog.open}
          onClose={closeComparison}
          snapshot={comparisonDialog.snapshot}
          currentData={data}
        />
      )}
    </Box>
  );
};

export default CustomAlerts;
