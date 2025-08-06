import { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AnalyticsOutlined, TrendingUp } from "@mui/icons-material";
import { AppSelector } from "../ui/AppSelector";
import { PeriodSelector } from "../ui/PeriodSelector";
import { GraphTabs } from "../ui/GraphTabs";
import { ChatForm } from "../ui/ChatForm";
import { GraphContainer } from "../ui/GraphContainer";

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
      light: "#8e9de8",
      dark: "#4f63d4",
    },
    secondary: {
      main: "#764ba2",
      light: "#9b7bc4",
      dark: "#5a3978",
    },
    background: {
      default: "transparent",
      paper: "rgba(255, 255, 255, 0.95)",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

export const Dashboard = () => {
  const [selectedAppId, setSelectedAppId] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [activeTab, setActiveTab] = useState("ltv");

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh" }}>
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ py: 1 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                mr: 2,
                width: 56,
                height: 56,
              }}
            >
              <AnalyticsOutlined fontSize="large" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" sx={{ mb: 0.5 }}>
                DG AppPay Dashboard
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Marketing support platform from DG Inc.
              </Typography>
            </Box>
            <Chip
              icon={<TrendingUp />}
              label="マーケティング分析 & AIコンサルティング"
              variant="outlined"
              sx={{
                background:
                  "linear-gradient(45deg, rgba(102, 126, 234, 0.1) 30%, rgba(118, 75, 162, 0.1) 90%)",
                borderColor: "primary.light",
                display: { xs: "none", md: "flex" },
              }}
            />
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 2, height: "calc(100vh - 80px)" }}>
          <Grid container spacing={3} sx={{ height: "100%" }}>
            {/* 左側エリア: 分析設定 + グラフ (2/3幅 = 8/12) */}
            <Grid
              size={{ xs: 12, lg: 8 }}
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              {/* 分析設定エリア - 高さを圧縮 */}
              <Paper sx={{ p: 2, mb: 2, flexShrink: 0 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "primary.dark", mb: 1 }}
                >
                  分析設定
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <AppSelector
                      selectedAppId={selectedAppId}
                      onAppChange={setSelectedAppId}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <PeriodSelector
                      selectedPeriod={selectedPeriod}
                      onPeriodChange={setSelectedPeriod}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }} sx={{ mt: {lg:-5}}}>
                    <GraphTabs
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* グラフエリア - 残り空間を使用 */}
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <GraphContainer
                  activeTab={activeTab}
                  selectedAppId={selectedAppId}
                  selectedPeriod={selectedPeriod}
                />
              </Box>
            </Grid>

            {/* 右側エリア: チャットフォーム (1/3幅 = 4/12) */}
            <Grid size={{ xs: 12, lg: 4 }} sx={{ height: "100%" }}>
              <ChatForm
                selectedAppId={selectedAppId}
                selectedPeriod={selectedPeriod}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
