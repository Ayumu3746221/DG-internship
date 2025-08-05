import {
  Paper,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { People } from "@mui/icons-material";
import useSWR from "swr";

// データを取得するfetcher関数
const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("データの取得に失敗しました");
  }
  return response.json();
};

// 期間に基づいて開始日と終了日を計算する関数
const calculateDateRange = (selectedPeriod) => {
  const endDate = new Date("2024-12-31");
  let startDate;

  switch (selectedPeriod) {
    case "1week":
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);
      break;
    case "1month":
      startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "1year":
      startDate = new Date(endDate);
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - 1);
  }

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
};

// 顧客属性データを分析する関数
const analyzeDemographics = (orders) => {
  if (!orders || !Array.isArray(orders)) {
    return {
      genderRatio: { male: 0, female: 0 },
      ageGroups: {},
      prefectures: {},
      totalRevenue: 0,
    };
  }

  const demographics = {
    genderRatio: { male: 0, female: 0 },
    ageGroups: {
      "10代": { count: 0, revenue: 0 },
      "20代": { count: 0, revenue: 0 },
      "30代": { count: 0, revenue: 0 },
      "40代": { count: 0, revenue: 0 },
      "50代+": { count: 0, revenue: 0 },
    },
    prefectures: {},
    totalRevenue: 0,
  };

  orders.forEach((order) => {
    const { customer, item } = order;

    // 性別集計
    if (customer.gender === "male") {
      demographics.genderRatio.male++;
    } else if (customer.gender === "female") {
      demographics.genderRatio.female++;
    }

    // 年齢層計算
    const birthYear = new Date(customer.birthDate).getFullYear();
    const age = 2024 - birthYear;
    let ageGroup;

    if (age < 20) ageGroup = "10代";
    else if (age < 30) ageGroup = "20代";
    else if (age < 40) ageGroup = "30代";
    else if (age < 50) ageGroup = "40代";
    else ageGroup = "50代+";

    demographics.ageGroups[ageGroup].count++;
    demographics.ageGroups[ageGroup].revenue += item.price;

    // 都道府県集計
    const prefecture = customer.prefecture.name;
    if (!demographics.prefectures[prefecture]) {
      demographics.prefectures[prefecture] = { count: 0, revenue: 0 };
    }
    demographics.prefectures[prefecture].count++;
    demographics.prefectures[prefecture].revenue += item.price;

    demographics.totalRevenue += item.price;
  });

  return demographics;
};

export const DemographicsGraph = ({ selectedAppId, selectedPeriod }) => {
  const color = "#6f42c1";

  // 期間に基づいて日付範囲を計算
  const { startDate, endDate } = calculateDateRange(selectedPeriod);

  // APIからデータを取得
  const apiUrl = selectedAppId
    ? `https://tjufwmnunr.ap-northeast-1.awsapprunner.com/api/v1/orders?appId=${selectedAppId}&status=completed&sort=desc`
    : null;

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  // データを分析
  const demographics = data?.meta?.isSuccess
    ? analyzeDemographics(data.orders)
    : null;

  // 性別比率の計算
  const totalUsers = demographics
    ? demographics.genderRatio.male + demographics.genderRatio.female
    : 0;
  const malePercentage =
    totalUsers > 0
      ? Math.round((demographics.genderRatio.male / totalUsers) * 100)
      : 0;
  const femalePercentage =
    totalUsers > 0
      ? Math.round((demographics.genderRatio.female / totalUsers) * 100)
      : 0;

  // 都道府県上位3位を計算
  const topPrefectures = demographics
    ? Object.entries(demographics.prefectures)
        .sort(([, a], [, b]) => b.revenue - a.revenue)
        .slice(0, 3)
        .map(([name, data]) => ({
          name,
          percentage: Math.round(
            (data.revenue / demographics.totalRevenue) * 100
          ),
        }))
    : [];

  // 年齢層データの正規化（最大値を100として）
  const maxAgeRevenue = demographics
    ? Math.max(
        ...Object.values(demographics.ageGroups).map((group) => group.revenue)
      )
    : 1;

  // エラー状態
  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
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
          height: "100%",
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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
        backdropFilter: "blur(10px)",
        border: `2px solid ${color}20`,
      }}
    >
      {/* ヘッダー */}
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
          <People fontSize="large" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: color }}>
            顧客属性分析
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isLoading
              ? "データを読み込み中..."
              : demographics
              ? `男性${malePercentage}% / 女性${femalePercentage}% | 総売上: ¥${demographics.totalRevenue.toLocaleString()}`
              : "データなし"}
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
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="100%" height="450" viewBox="0 0 500 300">
            {/* 性別比率の円グラフ */}
            <g transform="translate(120, 150)">
              {/* 男性部分 */}
              <path
                d={`M 0,-60 A 60,60 0 ${malePercentage > 50 ? 1 : 0},1 ${
                  Math.sin((malePercentage / 100) * 2 * Math.PI) * 60
                },${
                  -Math.cos((malePercentage / 100) * 2 * Math.PI) * 60
                } L 0,0 Z`}
                fill={color}
                opacity="0.8"
              />
              {/* 女性部分 */}
              <path
                d={`M ${Math.sin((malePercentage / 100) * 2 * Math.PI) * 60},${
                  -Math.cos((malePercentage / 100) * 2 * Math.PI) * 60
                } A 60,60 0 ${femalePercentage > 50 ? 1 : 0},1 0,-60 L 0,0 Z`}
                fill="#dc3545"
                opacity="0.6"
              />
              {/* 中央のラベル */}
              <text
                x="0"
                y="-5"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#333"
              >
                性別比率
              </text>
              <text x="0" y="10" textAnchor="middle" fontSize="10" fill="#666">
                男性{malePercentage}%
              </text>
              <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
                女性{femalePercentage}%
              </text>
            </g>

            {/* 年齢層の棒グラフ */}
            <g transform="translate(280, 50)">
              <text
                x="60"
                y="20"
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#333"
              >
                年齢層別課金額
              </text>

              {/* 年齢層バー */}
              {demographics &&
                Object.entries(demographics.ageGroups).map(
                  ([ageGroup, data], index) => {
                    const height = (data.revenue / maxAgeRevenue) * 100;
                    return (
                      <g key={ageGroup}>
                        <rect
                          x={index * 25}
                          y={150 - height}
                          width="20"
                          height={height}
                          fill={color}
                          opacity={0.6 + index * 0.1}
                          rx="2"
                        />
                        <text
                          x={index * 25 + 10}
                          y={170}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#666"
                        >
                          {ageGroup}
                        </text>
                        <text
                          x={index * 25 + 10}
                          y={150 - height - 5}
                          textAnchor="middle"
                          fontSize="8"
                          fill="#666"
                        >
                          ¥{Math.round(data.revenue / 1000)}K
                        </text>
                      </g>
                    );
                  }
                )}
            </g>

            {/* 都道府県トップ3 */}
            <g transform="translate(50, 230)">
              <text x="0" y="0" fontSize="12" fontWeight="bold" fill="#333">
                課金額上位地域
              </text>
              {topPrefectures.map((prefecture, index) => (
                <text
                  key={prefecture.name}
                  x={index * 120}
                  y="20"
                  fontSize="10"
                  fill={color}
                >
                  {index + 1}位: {prefecture.name} ({prefecture.percentage}%)
                </text>
              ))}
            </g>

            {/* 凡例 */}
            <g transform="translate(400, 60)">
              <circle cx="0" cy="0" r="6" fill={color} opacity="0.8" />
              <text x="12" y="4" fontSize="10" fill={color}>
                男性
              </text>
              <circle cx="0" cy="20" r="6" fill="#dc3545" opacity="0.6" />
              <text x="12" y="24" fontSize="10" fill="#dc3545">
                女性
              </text>
            </g>
          </svg>
        </Box>
      </Box>

      {/* フッター情報 */}
      {demographics && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: "1px solid",
            borderTopColor: "divider",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            最終更新: {new Date().toLocaleString("ja-JP")} | 総ユーザー数:{" "}
            {totalUsers}人 | 期間: {startDate} ～ {endDate}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
