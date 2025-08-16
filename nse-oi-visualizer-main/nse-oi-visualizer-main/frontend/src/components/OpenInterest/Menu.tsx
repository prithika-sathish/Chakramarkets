import { useSelector } from "react-redux";
import { getNextUpdateAt } from "../../features/selected/selectedSlice";
import { Box, Typography, Paper } from "@mui/material";
import SelectUnderlying from "./SelectUnderlying";
import Expiries from "./Expiries";
import StrikeRange from "./StrikeRange";

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

const Menu = () => {
  return (
    <Box sx={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      gap: 2 
    }}>
      <SelectUnderlying/>
      <Expiries/>
      <StrikeRange/>
      <NextUpdateAt/>
    </Box>
  );
};

export default Menu;