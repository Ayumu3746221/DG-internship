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


const aggregateSales = (orders, period) => {
  if (!orders || !Array.isArray(orders)) return [];

  // 期間フィルタ用の日付を計算
  const endDate = new Date("2024-12-31T23:59:59");
  let startDate = new Date(endDate);

    if (period === "1week") {
    startDate.setDate(endDate.getDate() - 6); // 12/25～12/31の7日間
    } else if (period === "1month") {
    startDate.setMonth(endDate.getMonth() - 1); // 11/31→12/31の1か月間
    // setDateは不要
    } else if (period === "1year") {
    startDate.setMonth(0);
    startDate.setDate(1);
    }

  const result = {};

  orders.forEach((order) => {
    const dateObj = new Date(order.orderAt);
    // 期間外はスキップ
    if (period !== "1year" && (dateObj < startDate || dateObj > endDate)) return;
    if (period === "1year" && (dateObj < startDate || dateObj > endDate)) return;

    let key, label;
    if (period === "1year") {
      key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
      label = `${dateObj.getMonth() + 1}月`;
    } else {
      key = dateObj.toISOString().split("T")[0];
      label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
    }

    if (!result[key]) {
      result[key] = { label, sales: 0, orderCount: 0 };
    }
    result[key].sales += order.item.price;
    result[key].orderCount += 1;
  });

  return Object.keys(result)
    .sort()
    .map((key) => ({
      ...result[key],
      dateKey: key,
    }));
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

export const SalesChart = ({ selectedAppId, selectedPeriod }) => {
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
  const chartData = aggregateSales(orders, selectedPeriod);

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
        <XAxis dataKey="label" />
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
