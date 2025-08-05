import { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Chip
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AnalyticsOutlined, TrendingUp } from '@mui/icons-material';
import { AppSelector } from '../ui/AppSelector';
import { PeriodSelector } from '../ui/PeriodSelector';
import { GraphTabs } from '../ui/GraphTabs';
import { ChatForm } from '../ui/ChatForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#8e9de8',
      dark: '#4f63d4',
    },
    secondary: {
      main: '#764ba2',
      light: '#9b7bc4',
      dark: '#5a3978',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export const Dashboard = () => {
  const [selectedAppId, setSelectedAppId] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [activeTab, setActiveTab] = useState('ltv');

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ py: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                mr: 2,
                width: 56,
                height: 56
              }}
            >
              <AnalyticsOutlined fontSize="large" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" sx={{ mb: 0.5 }}>
                アプリペイ ダッシュボード
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                データドリブンマーケティング支援プラットフォーム
              </Typography>
            </Box>
            <Chip
              icon={<TrendingUp />}
              label="マーケティング分析 & AIコンサルティング"
              variant="outlined"
              sx={{
                background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1) 30%, rgba(118, 75, 162, 0.1) 90%)',
                borderColor: 'primary.light',
                display: { xs: 'none', md: 'flex' }
              }}
            />
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.dark' }}>
                  分析設定
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  アプリケーション、期間、分析タイプを選択してデータを可視化
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <AppSelector
                      selectedAppId={selectedAppId}
                      onAppChange={setSelectedAppId}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <PeriodSelector
                      selectedPeriod={selectedPeriod}
                      onPeriodChange={setSelectedPeriod}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <GraphTabs
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <Box sx={{ height: '700px' }}>
                <ChatForm />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};