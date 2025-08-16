import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useOpenInterestQuery, openInterestApi } from "../../app/services/openInterest";
import { getUnderlying } from "../../features/selected/selectedSlice";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Menu from "./Menu";
import PNLVisualizer from "./PNLVisualizer";
import PNLControls from "./PNLControls";
import LoadingOverlay from "../Common/LoadingOverlay";
import FloatingDrawer from "../Common/FloatingDrawer";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const StrategyBuilder = () => {
  const dispatch = useDispatch();
  const viewportTheme = useTheme();
  const isLargeScreen = useMediaQuery(viewportTheme.breakpoints.up("lg"));
  const underlying = useSelector(getUnderlying);
  const { isFetching, isError } = useOpenInterestQuery({ underlying: underlying });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (isLargeScreen) {
      setDrawerOpen(false);
    };
  }, [isLargeScreen]);

  useEffect(() => {
    const IntervalWorker: Worker = new Worker(new URL("../../worker/IntervalWorker.ts", import.meta.url));
    IntervalWorker.postMessage({ action: "start" });
    IntervalWorker.onmessage = (e: MessageEvent) => {
      if (e.data === "get-oi") {
        console.log("getting oi data");
        dispatch(openInterestApi.util.invalidateTags(["OpenInterest"]));
      };
    };

    return () => {
      console.log("terminating worker");
      IntervalWorker.terminate();
    };

  }, [underlying]);

  return (
    <>
      <Box sx={{ p: 3 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Trade Planner
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Simulate and test option strategies before committing real money
          </Typography>
        </Box>

        {/* Info Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'primary.light', backgroundColor: 'primary.50' }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <LightbulbIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600, mb: 1 }}>
                  Plan Your Strategy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Build complex option strategies with multiple legs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'success.light', backgroundColor: 'success.50' }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" color="success.main" sx={{ fontWeight: 600, mb: 1 }}>
                  Risk Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Understand potential profits and losses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'warning.light', backgroundColor: 'warning.50' }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <TrendingDownIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600, mb: 1 }}>
                  Test Scenarios
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  See how your strategy performs in different market conditions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {(isFetching || isError) && (
            <Box sx={{ 
              position: "absolute", 
              inset: 0, 
              zIndex: (theme) => theme.zIndex.drawer + 1, 
              height: "100vh", 
              width: "100%" 
            }}>
              <LoadingOverlay type="page" isError={isError} message="Fetching IVs and Prices" />
            </Box>
          )}
          
          {isLargeScreen && (
            <Grid item lg={3.7}>
              <Box sx={{ 
                height: "calc(100vh - 200px)", 
                width: "100%", 
                position: "sticky", 
                top: "80px" 
              }}>
                <Menu />
              </Box>
            </Grid>
          )}
          
          <Grid item xs={12} lg={8.3}>
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              backgroundColor: "background.paper", 
              borderRadius: 2,
              border: 1, 
              borderColor: "divider", 
              gap: 3,
              p: 3
            }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Strategy Visualization
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The chart below shows how your option strategy will perform at different underlying prices. 
                  Green areas indicate profits, red areas indicate losses.
                </Typography>
              </Box>
              
              <PNLVisualizer />
              <PNLControls />
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <FloatingDrawer
        showButton={!isLargeScreen} 
        open={drawerOpen} 
        onChange={setDrawerOpen}
      >
        <Menu />
      </FloatingDrawer>
    </>
  );
};

export default StrategyBuilder;