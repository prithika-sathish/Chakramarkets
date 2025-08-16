import { useMemo, useState } from "react";
import * as d3 from "d3";
import { bisector } from "d3";
import { type DataItem } from "../../../features/selected/types";
import useChartDimensions from "../../../hooks/useChartDimensions";
import BarGroup from "./BarGroup";
import XAxis from "./XAxis";
import YAxis from "./YAxis";
import LoadingOverlay from "../../Common/LoadingOverlay";
import Tooltip from "./Tooltip";
import { Box, Typography } from "@mui/material";

export const bisectDate = (data: number[], x0: number) => {
  const dateBisector = bisector((d) => d).center;
  const index = dateBisector(data, x0, 1);
  const d0 = data[index - 1];
  const d1 = data[index];
  return d1 && (x0 - d0 > d1 - x0) ? d1 : d0;
};

type TooltipState = {
  show: boolean,
  strikePrice: string | null,
  callOI: number | null,
  putOI: number | null,
  callPrice: number | null,
  putPrice: number | null,
  iv: number | null,
}

type OIChartProps = {
  data: DataItem[],
  type: "changeinOpenInterest" | "openInterest",
  isFetching: boolean,
  isError: boolean,
  underlyingPrice?: number | null,
};

const OIChart = ({ data, underlyingPrice, type, isFetching, isError }: OIChartProps) => {

  const [mouseXPos, setMouseXPos] = useState<number | null>(null);
  const [mouseYPos, setMouseYPos] = useState<number | null>(null);
  const [chartContainerRef, chartDimensions] = useChartDimensions();

  const [tooltipState, setTooltipState] = useState<TooltipState>({
    show: false,
    strikePrice: null,
    callOI: null,
    putOI: null,
    callPrice: null,
    putPrice: null,
    iv: null,
  });

  // Validate data to prevent crashes
  const validData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data.filter(item => item && item.strikePrice !== undefined);
  }, [data]);

  const { 
    width, 
    height, 
    marginTop,
    marginBottom, 
    marginLeft, 
    boundedWidth, 
    boundedHeight 
  } = chartDimensions;

  const xScale = useMemo(() => {
    if (validData.length === 0) return d3.scaleBand().domain([]).range([0, boundedWidth]);
    
    return d3.scaleBand()
      .domain(validData.map((d) => String(d.strikePrice)))
      .range([0, boundedWidth])
      .padding(0.3)
  }, [boundedWidth, validData]);

  const xSubGroupScale = useMemo(() => {
    if (validData.length === 0) return d3.scaleBand().domain([]).range([0, 0]);
    
    return d3.scaleBand()
      .domain(["PE", "CE"].map((d) => d))
      .range([0, xScale.bandwidth()])
  }, [xScale.bandwidth, validData]);

  const yScale = useMemo(() => {
    if (validData.length === 0) return d3.scaleLinear().domain([0, 1]).range([boundedHeight, 0]);
 
    const [min, max] = [
      Math.min(
        d3.min(validData, (d) => {
          if (!d.CE || !d.PE) return 0;
          
          return Math.min(
            d.CE[type] || -1, 
            d.PE[type] || -1, 
          );
        }) || 0,
        0
      ), 
      d3.max(
        validData, (d) => {
          if (!d.CE || !d.PE) return 0;
    
          return Math.max(
            d.CE[type] || 1, 
            d.PE[type] || 1, 
          );
        }
      ) || 1
    ];

    return d3.scaleLinear()
      .domain([min || 0, max || 0])
      .range([boundedHeight, 0])
  }, [boundedHeight, validData, type]);

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    try {
      // Get mouse position relative to the SVG
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Ensure we're within bounds
      if (x < 0 || x > boundedWidth || y < 0 || y > boundedHeight) {
        return;
      }

      // Iterate through the bands to find the one closest to the x position
      let nearestBandIndex = 0;
      let minDistance = boundedWidth;

      xScale.domain().forEach((band, index) => {
        const bandPosition = xScale(band) || 0;
        const distance = Math.abs(x - (bandPosition + xScale.bandwidth() / 2));

        if (distance < minDistance) {
          minDistance = distance;
          nearestBandIndex = index;
        }
      });

      const nearestStrikePrice = xScale.domain()[nearestBandIndex];

      if (nearestStrikePrice) {
        const nearestStrikePriceData = data.find((d) => String(d.strikePrice) === nearestStrikePrice);

        if (nearestStrikePriceData) {
          setTooltipState({
            show: true,
            strikePrice: nearestStrikePrice,
            callOI: nearestStrikePriceData.CE?.[type] || 0,
            putOI: nearestStrikePriceData.PE?.[type] || 0,
            callPrice: nearestStrikePriceData.CE?.lastPrice || 0,
            putPrice: nearestStrikePriceData.PE?.lastPrice || 0,
            iv: nearestStrikePriceData.iv || 0,
          });
        }
      }

      setMouseXPos(x + 10);
      setMouseYPos(y);
    } catch (error) {
      console.error('Error in handleMouseMove:', error);
      // Don't crash the component, just hide tooltip
      setTooltipState({
        show: false,
        strikePrice: null,
        callOI: null,
        putOI: null,
        callPrice: null,
        putPrice: null,
        iv: null,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipState({
      show: false,
      strikePrice: null,
      callOI: null,
      putOI: null,
      callPrice: null,
      putPrice: null,
      iv: null,
    });

    setMouseXPos(null);
    setMouseYPos(null);
  };

  const bars = useMemo(() => {
    if (validData.length === 0) return null;
    
    return validData.map((d) => {
      const hovered = tooltipState.strikePrice === String(d.strikePrice);

      return <BarGroup
        key={d.strikePrice} 
        d={d} 
        xScale={xScale} 
        xSubGroupScale={xSubGroupScale} 
        yScale={yScale}
        boundedHeight={boundedHeight}
        type={type}
        hovered={hovered}
      />
    });
  }, [validData, xScale, xSubGroupScale, yScale, boundedHeight, type, tooltipState.strikePrice]);

  const xAxis = useMemo(() => {
    return <foreignObject
      id="g" 
      transform={`translate(${[
      0,
      boundedHeight,
    ].join(",")})`}
      width={boundedWidth}
      height={marginBottom}
      style={{ overflow: "visible" }}
    >
      <XAxis
        xScale={xScale}
        yScale={yScale}
        boundedHeight={boundedHeight}
        label="Strike Price"
        underlyingPrice={underlyingPrice}
      />
    </foreignObject>
  }, [xScale, yScale, boundedHeight, marginBottom, boundedWidth, underlyingPrice]);

  const yAxis = useMemo(() => {
    return <YAxis
      yScale={yScale}
      boundedWidth={boundedWidth}
      label={type === "changeinOpenInterest" ? "OI Change" : "OI Total"}
    />
  }, [yScale, type]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
      {(isFetching || isError) && <LoadingOverlay isError={isError} />}
      
      {/* Show message when no data */}
      {!isFetching && !isError && validData.length === 0 && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '100%', 
          height: '100%',
          color: 'text.secondary'
        }}>
          <Typography variant="body1">No data available for the selected criteria</Typography>
        </Box>
      )}
      
      {/* Only render chart when we have valid data */}
      {validData.length > 0 && (() => {
        try {
          return (
            <svg width={width} height={height}>
              <g transform={`translate(${[
                marginLeft,
                marginTop
              ].join(",")})`}
              >
                {yAxis}
                {bars}
                {xAxis}
                <Tooltip
                  type={type}
                  show={tooltipState.show}
                  x={mouseXPos || 0}
                  y={mouseYPos || 0}
                  strikePrice={tooltipState.strikePrice}
                  callOIValue={tooltipState.callOI}
                  putOIValue={tooltipState.putOI}
                  callPrice={tooltipState.callPrice}
                  putPrice={tooltipState.putPrice}
                  iv={tooltipState.iv}
                  boundedHeight={boundedHeight}
                  boundedWidth={boundedWidth}
                />
                <rect
                  width={boundedWidth}
                  height={boundedHeight}
                  fill="transparent"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                />
              </g>
            </svg>
          );
        } catch (error) {
          console.error('Error rendering chart:', error);
          return (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '100%', 
              height: '100%',
              color: 'error.main'
            }}>
              <Typography variant="body1">Error rendering chart. Please refresh the page.</Typography>
            </Box>
          );
        }
      })()}
    </div>
  );
};

export default OIChart;