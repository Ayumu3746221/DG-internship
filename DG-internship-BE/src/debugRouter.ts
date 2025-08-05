import { Hono } from "hono";
import { fetchAndPrepareData } from "../services/fetchAndPrepareData.js";
import { runLtvBatchProcess } from "../services/runLtvBatchProcess.js";

const debug = new Hono();

/**
 * デバッグ用エンドポイント：fetchAndPrepareData関数の状態確認
 */
debug.get("/fetch-data/:appId", async (c) => {
  try {
    const appId = c.req.param("appId");

    if (!appId) {
      return c.json(
        {
          success: false,
          message: "appId parameter is required",
        },
        400
      );
    }

    console.log(`Debug: Fetching data for appId: ${appId}`);

    const userHistoryMap = await fetchAndPrepareData(appId);

    // Mapを配列形式に変換してJSONで返却可能にする
    const result = Array.from(userHistoryMap.entries()).map(
      ([userId, transactions]) => ({
        userId,
        transactionCount: transactions.length,
        transactions: transactions.map((t) => ({
          userId: t.userId,
          price: t.price,
          date: t.date.toISOString(),
          dateReadable: t.date.toLocaleString(),
        })),
      })
    );

    return c.json({
      success: true,
      data: {
        totalUsers: userHistoryMap.size,
        totalTransactions: Array.from(userHistoryMap.values()).reduce(
          (sum, transactions) => sum + transactions.length,
          0
        ),
        userHistories: result,
      },
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

/**
 * デバッグ用エンドポイント：LTVバッチプロセスの確認
 */
debug.get("/ltv-batch/:appId", async (c) => {
  try {
    const appId = c.req.param("appId");

    if (!appId) {
      return c.json(
        {
          success: false,
          message: "appId parameter is required",
        },
        400
      );
    }

    const startDateParam = c.req.query("startDate");
    const endDateParam = c.req.query("endDate");

    let startDate = new Date("2024-01-01T00:00:00Z");
    let endDate = new Date("2024-12-31T23:59:59Z");

    if (startDateParam) {
      startDate = new Date(startDateParam);
    }
    if (endDateParam) {
      endDate = new Date(endDateParam);
    }

    console.log(`Debug: Running LTV batch process for appId: ${appId}`);

    // まず全ユーザー数を取得
    const userHistoryMap = await fetchAndPrepareData(appId);
    const totalUniqueUsers = userHistoryMap.size;

    const chartData = await runLtvBatchProcess(appId, startDate, endDate);

    // 統計情報を正しく計算
    const totalDays = chartData.length;
    const avgHigh =
      chartData.reduce((sum, day) => sum + day.high, 0) / totalDays || 0;
    const avgMiddle =
      chartData.reduce((sum, day) => sum + day.middle, 0) / totalDays || 0;
    const avgLow =
      chartData.reduce((sum, day) => sum + day.low, 0) / totalDays || 0;

    return c.json({
      success: true,
      data: {
        appId,
        period: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          totalDays,
        },
        statistics: {
          totalUniqueUsers, // 実際のユニークユーザー数
          averageSegmentCounts: {
            high: Math.round(avgHigh * 100) / 100,
            middle: Math.round(avgMiddle * 100) / 100,
            low: Math.round(avgLow * 100) / 100,
          },
        },
        chartData: chartData.slice(0, 10),
        totalDataPoints: chartData.length,
      },
    });
  } catch (error) {
    console.error("LTV batch process error:", error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

/**
 * 全データを取得するエンドポイント（注意：大量データの場合があります）
 */
debug.get("/ltv-batch/:appId/full", async (c) => {
  try {
    const appId = c.req.param("appId");

    if (!appId) {
      return c.json(
        {
          success: false,
          message: "appId parameter is required",
        },
        400
      );
    }

    const startDateParam = c.req.query("startDate");
    const endDateParam = c.req.query("endDate");

    let startDate = new Date("2024-01-01T00:00:00Z");
    let endDate = new Date("2024-01-31T23:59:59Z"); // デフォルトは1ヶ月分のみ

    if (startDateParam) {
      startDate = new Date(startDateParam);
    }
    if (endDateParam) {
      endDate = new Date(endDateParam);
    }

    console.log(`Debug: Running full LTV batch process for appId: ${appId}`);

    const chartData = await runLtvBatchProcess(appId, startDate, endDate);

    return c.json({
      success: true,
      data: {
        appId,
        period: {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
        chartData,
      },
    });
  } catch (error) {
    console.error("Full LTV batch process error:", error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

export default debug;
