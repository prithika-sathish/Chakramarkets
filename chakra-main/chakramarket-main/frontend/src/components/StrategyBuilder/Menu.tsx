import { useSelector } from "react-redux";
import { getNextUpdateAt } from "../../features/selected/selectedSlice";
import { Box, Typography, Paper } from "@mui/material";
import SelectUnderlying from "../OpenInterest/SelectUnderlying";
import Strategy from "./Strategy";

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
  );
};

const Menu = () => {
  return (
    <Box sx={{ 
      height: "100%", 
      width: "100%", 
      display: "flex", 
      flexDirection: "column", 
      gap: 2 
    }}>
      <SelectUnderlying/>
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        width: "100%", 
        overflowY: "auto", 
        gap: 2 
      }}>
        <Strategy/>
        <NextUpdateAt/>
      </Box>
    </Box>
  );
};

export default Menu;