"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import useSWR from "swr";
import { convertUnixToDate } from "../utils/convertUnixToDate.js";

// データを取得するfetcher関数
const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("データの取得に失敗しました");
  }
  return response.json();
};

// APIデータから月別売上を計算する関数
const calculateMonthlySales = (orders) => {
  if (!orders || !Array.isArray(orders)) return [];

  // 月別売上を集計するオブジェクト
  const monthlySales = {};

  orders.forEach((order) => {
    // Unix timestampを日付に変換
    const date = convertUnixToDate(order.orderAt);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const monthLabel = `${date.getMonth() + 1}月`;

    // 月別売上を累計
    if (!monthlySales[monthKey]) {
      monthlySales[monthKey] = {
        month: monthLabel,
        sales: 0,
        orderCount: 0,
      };
    }

    monthlySales[monthKey].sales += order.item.price;
    monthlySales[monthKey].orderCount += 1;
  });

  // オブジェクトを配列に変換し、月順でソート
  return Object.keys(monthlySales)
    .sort()
    .map((key) => monthlySales[key]);
};

const formatYAxis = (tickItem) => {
  return `${tickItem.toLocaleString()}円`;
};

// カスタムツールチップ
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "hsl(var(--background))",
          borderColor: "hsl(var(--border))",
          border: "1px solid",
          padding: "12px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{`${label}`}</p>
        <p style={{ margin: "4px 0", color: "#28a745" }}>
          {`売上: ${payload[0].value.toLocaleString()}円`}
        </p>
        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#666" }}>
          {`注文件数: ${data.orderCount}件`}
        </p>
      </div>
    );
  }
  return null;
};

export const SalesChart = ({ selectedAppId }) => {
  // useSWRでAPIデータを取得
  const { data, error, isLoading } = useSWR(
    selectedAppId
      ? `http://localhost:3000/api/debug/fetch-data/${selectedAppId}`
      : null,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  // APIレスポンスから注文データを抽出
  const orders =
    data?.success && data?.data?.userHistories
      ? data.data.userHistories.flatMap((user) =>
          user.transactions.map((transaction) => ({
            orderAt: new Date(transaction.date).getTime(),
            item: { price: transaction.price },
          }))
        )
      : [];

  // 月別売上データを計算
  const chartData = calculateMonthlySales(orders);

  // ローディング状態
  if (isLoading) {
    return (
      <div
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>データを読み込み中...</p>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "red" }}>
          データの取得に失敗しました: {error.message}
        </p>
      </div>
    );
  }

  // アプリが選択されていない場合
  if (!selectedAppId) {
    return (
      <div
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>アプリを選択してください</p>
      </div>
    );
  }

  // データがない場合
  if (chartData.length === 0) {
    return (
      <div
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>売上データがありません</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          name="合計購入金額"
          stroke="#28a745"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
