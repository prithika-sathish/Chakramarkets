import { Routes, Route, Navigate } from "react-router-dom";
import Layout from './components/Layout';
import Welcome from './components/Welcome';
import OpenInterest from './components/OpenInterest';
import StrategyBuilder from "./components/StrategyBuilder";
import CustomAlerts from "./components/CustomAlerts";
import ToastContextProvider from "./contexts/ToastContextProvider";
import Toast from "./components/Common/Toast";

function App() {
  return (
    <ToastContextProvider>
      <Toast />
      <Routes>
        <Route path="/*" element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="position-tracker" element={<OpenInterest />} />
          <Route path="trade-planner" element={<StrategyBuilder />} />
          <Route path="custom-alerts" element={<CustomAlerts />} />
        </Route>
      </Routes>
    </ToastContextProvider>
  );
};

export default App;
