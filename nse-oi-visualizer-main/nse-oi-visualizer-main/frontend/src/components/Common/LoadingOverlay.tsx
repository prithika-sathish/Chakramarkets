import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

type LoadingOverlayProps = {
  message?: string;
  errorMessage?: string;
  type?: "page" | "component";
  isError: boolean;
  opaque?: boolean;
};

const LoadingOverlay = ({ message, type = "component", isError, errorMessage, opaque = false }: LoadingOverlayProps) => {
  const defaultLoadingMessage = "Fetching data...";
  const defaultErrorMessage = "Failed to fetch data. Refresh the page.";

  let content = (
    <>
      {isError ? (
        <Typography variant="body1" color="inherit" sx={{ fontWeight: 400, mb: 2 }}>
          {errorMessage || defaultErrorMessage}
        </Typography>
      ) : (
        <>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body1" color="inherit" sx={{ fontWeight: 400 }}>
            {message || defaultLoadingMessage}
          </Typography>
        </>
      )}
    </>
  );

  if (type === "page") {
    content = (
      <Box sx={{ 
        display: "flex", 
        width: "100%", 
        maxWidth: "300px", 
        flexDirection: "column", 
        alignItems: "center",
        gap: 2
      }}>
        {isError ? (
          <Typography variant="body1" color="inherit" sx={{ fontWeight: 400 }}>
            {errorMessage || defaultErrorMessage}  
          </Typography>
        ) : (
          <>
            <Typography variant="h6" sx={{ color: "primary.main", textAlign: "center" }}>
              {message || defaultLoadingMessage}
            </Typography>
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          </>
        )}
      </Box> 
    );
  };
  
  return (
    <Box sx={{ 
      position: "absolute", 
      height: "100%", 
      width: "100%", 
      zIndex: 10, 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      backdropFilter: "blur(3px)" 
    }}>
      <Box sx={{ 
        position: "absolute", 
        height: "100%", 
        width: "100%", 
        backgroundColor: "background.paper", 
        opacity: opaque ? 1 : 0.7 
      }}/>
      <Box sx={{ 
        position: "absolute", 
        height: "100%", 
        width: "100%", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        flexDirection: "column" 
      }}>
        {content}
      </Box>
    </Box>
  );
};

export default LoadingOverlay;