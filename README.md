ChakraMarkets - Options Trading Analytics Platform
A modern React application inspired by Sensibull, that visualizes real-time Open Interest data and Option Strategy Profit and Loss for Indian Benchmark Indices and F&O stocks. The app fetches data from NSE API to show OI bar plots and Strategy Payoff line plots. The data is auto-updated at 3-minute intervals. Frontend is built with React, Material UI, Redux and D3. Backend is built with NodeJS.

Demo
Usage Demo

Features
Fetches Real-time Open Interest data of Indian Benchmark Indices (NIFTY, BANKNIFTY, FINNIFTY and MIDCPNIFTY) and F&O stocks listed on NSE (185 stocks).
Shows Change in Open Interest and Total Open Interest.
Has a multi expiry selector to see combined Open Interest. With 4 (2 weekly, 2 monthly) selectable expiries for indices and 2 (2 monthly) selectable expiries for stocks.
Has a Strike range selector to adjust the no. of strikes to be shown.
Shows Option Strategy Payoff (P&L) at a target date as well as the expiry date for the selected underlying (maximum 10 legs).
Uses Black-76 model to calculate IVs for each strike, and shows OTM option IV for both call and put.
All IVs are calculated based on a synthetic (implied) futures price, computed with put-call parity formula based on the ATM option for each expiry.
Auto-updates data, using a web worker, precisely at times when the minutes are divisible by 3 (ex: 9:30, 9:33, 9:36,...,9:57, 10:00 etc).
Caches data with RTK Query for a maximum of 3 minutes.
Charts have tooltips.
Local storage persistence of the selected underlying.
How to run it locally
Clone the repository.
cd into backend directory and run npm install to install dependencies.
Run 'npm run dev' to start the proxy server.
cd into frontend directory and run npm install to install dependencies.
Run 'npm run dev' to start the frontend app.
Open http://localhost:5173/ in your browser.
You are good to go.
To be done
Improved UI/UX.
Implement Error Boundaries and show appropriate error messages.
Add strategy presets.
FII and DII data visualization.
Note
IV calculation and Option price calculation Black-76/Generalized-Black-Scholes code is sourced from dedwards25/Python_Option_Pricing
Minor differences in IVs and as a result in Option Payoffs as compared to Sensibull might be down to the fact that all the IVs are being calculated on synthetic futures prices, whereas Sensibull uses actual futures prices where available for monthly expiries. Another reason might be due to variations in time to expiry calculations.
References
https://www.sensibull.com/ app.
https://sensibull.freshdesk.com/support/solutions/folders/43000300252 Sensibull explains the Math behind Option Pricing here.
https://2019.wattenberger.com/blog/react-and-d3 this is an insightful blog on how to use D3 with React, while keeping things Reacty.
https://www.nseindia.com/ data source.
Site link
https://chakramarkets.pages.dev/
