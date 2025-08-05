import { Hono } from "hono";
import { fetchAndPrepareData } from "../services/fetchLtvData/fetchAndPrepareData.js";
import { env } from "hono/adapter";

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

export default debug;
