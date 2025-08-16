import { useEffect, useState } from "react";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { useOpenInterestQuery, openInterestApi } from "../../app/services/openInterest";
import { type AppDispatch } from "../../store";
import { getUnderlying, getExpiries, setExpiries, getStrikeRange, getStrikeDistanceFromATM, 
  setMinMaxStrike, setNextUpdateAt } from "../../features/selected/selectedSlice";
import { getMinAndMaxStrikePrice, getNextTime } from "../../utils";
import useDeepMemo from "../../hooks/useDeepMemo";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import InfoIcon from "@mui/icons-material/Info";
import Menu from "./Menu";
import RedesignedDashboard from "./RedesignedDashboard";
import FloatingDrawer from "../Common/FloatingDrawer";

const OpenInterest = () => {
  const viewportTheme = useTheme();
  const isLargeScreen = useMediaQuery(viewportTheme.breakpoints.up("lg"));
  const dispatch = useDispatch<AppDispatch>();
  const underlying = useSelector(getUnderlying);
  const expiries = useSelector(getExpiries);
  const strikeRange = useSelector(getStrikeRange);
  const strikeDistanceFromATM = useSelector(getStrikeDistanceFromATM);
  const { data, isFetching, isError } = useOpenInterestQuery({ underlying: underlying });
  const filteredExpiries = useDeepMemo(data?.filteredExpiries);
  const allExpiries = useDeepMemo(data?.allExpiries);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (isLargeScreen) {
      setDrawerOpen(false);
    };
  }, [isLargeScreen]);

  useEffect(() => {
    if (data) {
      const { strikePrices, underlyingValue } = data;
      
      if (strikeDistanceFromATM === null) return;
      const { minStrike, maxStrike } = getMinAndMaxStrikePrice(
        strikePrices, 
        underlyingValue, 
        strikeDistanceFromATM
      );
      dispatch(setMinMaxStrike({ min: minStrike, max: maxStrike }));
    };
  }, [data, strikeDistanceFromATM]);

  useEffect(() => {
    if (allExpiries && filteredExpiries) {
      const updatedExpiries = filteredExpiries.map((expiry, i) => {
        return {
          date: expiry,
          chosen: i < 2
        }
      });
      dispatch(setExpiries(updatedExpiries));
    };
  }, [allExpiries, filteredExpiries]);

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

  useEffect(() => {
    if (!isFetching && !isError) {
      const now = new Date();
      const nextTime = getNextTime(now);
      dispatch(setNextUpdateAt(nextTime));
    };
  }, [isFetching, isError]);

  return (
    <>
      <Grid container spacing={3} sx={{ height: "100%", width: "100%" }}>
        <Grid item xs={12}>
          <RedesignedDashboard />
        </Grid>
      </Grid>
      
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

export default OpenInterest;