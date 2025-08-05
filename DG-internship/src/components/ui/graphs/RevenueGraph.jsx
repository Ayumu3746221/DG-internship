import { SalesChart } from "../../SalesChart";
import { Paper, Box, Typography, Chip } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

export const RevenueGraph = ({ selectedAppId, selectedPeriod }) => {
  const color = "#28a745";

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
        backdropFilter: "blur(10px)",
        border: `2px solid ${color}20`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
          }}
        >
          <TrendingUp fontSize="large" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: color }}>
            曜日・時間別売上推移
          </Typography>
          <Typography variant="body2" color="text.secondary">
            平日平均: ¥850,000 → 土日平均: ¥1,105,000 (30%増)
          </Typography>
        </Box>
        {selectedAppId && selectedPeriod && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={selectedAppId}
              size="small"
              variant="outlined"
              sx={{ borderColor: color, color: color }}
            />
            <Chip
              label={
                selectedPeriod === "1week"
                  ? "1週間"
                  : selectedPeriod === "1month"
                  ? "1ヶ月"
                  : "1年"
              }
              size="small"
              variant="outlined"
              sx={{ borderColor: color, color: color }}
            />
          </Box>
        )}
      </Box>

      {/* グラフエリア */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.8)",
          borderRadius: 2,
          border: `1px solid ${color}20`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SalesChart selectedAppId={selectedAppId} selectedPeriod={selectedPeriod} />
        </Box>
      </Box>
      {selectedAppId && selectedPeriod && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: "1px solid",
            borderTopColor: "divider",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            最終更新: {new Date().toLocaleString("ja-JP")} |
            土日の売上が平日より30%高い傾向
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
