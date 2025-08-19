import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Alert
} from '@mui/material';
import { addHolding, type PortfolioHolding } from '../../features/portfolio/portfolioSlice';

interface AddHoldingFormProps {
  open: boolean;
  onClose: () => void;
}

const AddHoldingForm = ({ open, onClose }: AddHoldingFormProps) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'stock' as 'stock' | 'option',
    shares: '',
    purchasePrice: '',
    triggerPrice: '',
    optionType: 'CE' as 'CE' | 'PE',
    strike: '',
    expiry: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.symbol || !formData.shares || !formData.purchasePrice) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.type === 'option' && (!formData.strike || !formData.expiry)) {
      setError('Please fill in strike price and expiry for options');
      return;
    }

    const holding: PortfolioHolding = {
      id: Date.now().toString(),
      symbol: formData.symbol.toUpperCase(),
      type: formData.type,
      shares: parseInt(formData.shares),
      currentPrice: parseFloat(formData.purchasePrice), // Will be updated by API
      purchasePrice: parseFloat(formData.purchasePrice),
      triggerPrice: formData.triggerPrice ? parseFloat(formData.triggerPrice) : undefined,
      optionType: formData.type === 'option' ? formData.optionType : undefined,
      strike: formData.type === 'option' && formData.strike ? parseFloat(formData.strike) : undefined,
      expiry: formData.type === 'option' ? formData.expiry : undefined
    };

    dispatch(addHolding(holding));
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      symbol: '',
      type: 'stock',
      shares: '',
      purchasePrice: '',
      triggerPrice: '',
      optionType: 'CE',
      strike: '',
      expiry: ''
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Add New Holding
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Symbol *"
              value={formData.symbol}
              onChange={(e) => handleInputChange('symbol', e.target.value)}
              placeholder="e.g., AAPL, TSLA"
              helperText="Enter stock symbol or option underlying"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type *</InputLabel>
              <Select
                value={formData.type}
                label="Type *"
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                <MenuItem value="stock">Stock</MenuItem>
                <MenuItem value="option">Option</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantity *"
              type="number"
              value={formData.shares}
              onChange={(e) => handleInputChange('shares', e.target.value)}
              helperText={formData.type === 'option' ? 'Number of contracts' : 'Number of shares'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Purchase Price *"
              type="number"
              value={formData.purchasePrice}
              onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
              helperText="Price per share/contract"
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Trigger Price"
              type="number"
              value={formData.triggerPrice}
              onChange={(e) => handleInputChange('triggerPrice', e.target.value)}
              helperText="Optional: Alert price"
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
              }}
            />
          </Grid>
          
          {formData.type === 'option' && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Option Type *</InputLabel>
                  <Select
                    value={formData.optionType}
                    label="Option Type *"
                    onChange={(e) => handleInputChange('optionType', e.target.value)}
                  >
                    <MenuItem value="CE">Call (CE)</MenuItem>
                    <MenuItem value="PE">Put (PE)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Strike Price *"
                  type="number"
                  value={formData.strike}
                  onChange={(e) => handleInputChange('strike', e.target.value)}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry Date *"
                  type="date"
                  value={formData.expiry}
                  onChange={(e) => handleInputChange('expiry', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Add Holding
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddHoldingForm;
