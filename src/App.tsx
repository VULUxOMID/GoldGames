import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { theme } from './theme/theme';
import { store } from './store/store';
import AppRoutes from './routes';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <BrowserRouter>
            <AppRoutes />
            <Analytics />
            <SpeedInsights />
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
