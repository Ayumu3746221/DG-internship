import { Paper, Box, Typography, Chip } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useSWR from "swr";
import { useMemo } from 'react';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const transformChartData = (apiData) => {
  console.log("Transforming chart data:", apiData);

  if (!apiData || !Array.isArray(apiData)) return [];

  return apiData.map(
    (item, index) => (
      console.log("Transforming item:", item),
      {
        day: new Date(item.date).toLocaleString("ja-JP", {
          month: "short",
          day: "numeric",
        }),
        date: item.date,
        heavy: item.high,
        middle: item.middle,
        light: item.low,
        total: item.high + item.middle + item.low,
      }
    )
  );
};

// 2. Y軸の数値を「¥12K」のような形式にフォーマットする関数
const formatYAxis = (tickItem) => `${tickItem}人`;

// 3. グラフにマウスオーバーした際のカスタムツールチップ
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={4}
        sx={{
          p: 2,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(5px)",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ mb: 1 }}
        >{`${label}時点`}</Typography>
        {payload.map((p) => (
          <Typography key={p.name} variant="body2" sx={{ color: p.color }}>
            {`${p.name}: ${p.value.toLocaleString()}人`}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

export const LTVGraph = ({ selectedAppId, selectedPeriod }) => {
  const color = "#667eea";

  const { data, error, isLoading } = useSWR(
    selectedAppId
      ? `http://localhost:3000/api/${selectedAppId}/ltv/chart-data`
      : null,
    fetcher,
    {
      refreshInterval: 0, // 自動更新を無効化
      revalidateOnFocus: false,
    }
  );

  // チャートデータを変換
  const chartData = data?.success ? transformChartData(data.chartData) : [];

const filteredData = useMemo(() => {
  if (!selectedPeriod) {
    return chartData;
  }

  const now = new Date("2024-12-31");
  let startDate = new Date(now);

  switch (selectedPeriod) {
    case '1week':
      startDate.setDate(now.getDate() - 7);
      break;
    case '1month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case '1year':
      // まず月初にしてから1年前に
      startDate.setDate(1);
      startDate.setMonth(now.getMonth());
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return chartData;
  }

  return chartData.filter(item => {
    // item.dateが"YYYY-MM-DD"形式ならタイムゾーンずれ防止
    const itemDate = new Date(item.date + "T00:00:00");
    return itemDate >= startDate;
  });
}, [chartData, selectedPeriod]);

  // 統計情報を計算
  const stats =
    chartData.length > 0
      ? {
          totalDays: filteredData.length,
          avgHeavy: Math.round(
            filteredData.reduce((sum, item) => sum + item.heavy, 0) /
              filteredData.length
          ),
          avgMiddle: Math.round(
            filteredData.reduce((sum, item) => sum + item.middle, 0) /
              filteredData.length
          ),
          avgLight: Math.round(
            filteredData.reduce((sum, item) => sum + item.light, 0) /
              filteredData.length
          ),
          maxTotal: Math.max(...filteredData.map((item) => item.total)),
          minTotal: Math.min(...filteredData.map((item) => item.total)),
        }
      : null;

  // エラー状態
  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, height: "500px" }}>
        <Alert severity="error">
          データの取得に失敗しました: {error.message}
        </Alert>
      </Paper>
    );
  }

  // アプリIDが選択されていない場合
  if (!selectedAppId) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 4,
          height: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          アプリを選択してください
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{ 
        p: 2, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
        backdropFilter: 'blur(10px)',
        border: `2px solid ${color}20`,
      }}
    >
      {/* --- ヘッダー部分は変更なし --- */}
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
            セグメント別平均LTV推移
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

      {/* --- グラフエリアをRechartsに置き換え --- */}
      <Box sx={{ flex: 1, width: "100%", height: "100%" }}>
        <ResponsiveContainer>
          <LineChart
            data={filteredData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "#333" }}>{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="light"
              name="ライト"
              stroke="#667eea"
              strokeWidth={3}
              activeDot={{ r: 8 }}
              dot={false}
              animationDuration={1500}
            />
            <Line
              type="monotone"
              dataKey="middle"
              name="ミドル"
              stroke="#764ba2"
              strokeWidth={3}
              activeDot={{ r: 8 }}
              dot={false}
              animationDuration={1500}
              animationBegin={200}
            />
            <Line
              type="monotone"
              dataKey="heavy"
              name="ヘビー"
              stroke="#8e9de8"
              strokeWidth={3}
              activeDot={{ r: 8 }}
              dot={false}
              animationDuration={1500}
              animationBegin={400}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* --- フッター情報も変更なし --- */}
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
            最終更新: {new Date().toLocaleString("ja-JP")} | セグメント:
            課金額によるユーザー分類
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
