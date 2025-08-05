import { serve } from "@hono/node-server";
import { Hono } from "hono";
import cors from "hono/cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat.js";
import debug from "./debugRouter.js";
import { runLtvBatchProcess } from "../services/runLtvBatchProcess.js";

// 環境変数の読み込み
dotenv.config();

const app = new Hono();

// CORS設定：フロントエンドからのアクセスを許可
app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173", "http://localhost:3001"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.json({ message: "DG Internship Backend API", version: "1.0.0" });
});

app.get("/api/:appId/ltv/chart-data", async (c) => {
  const appId = c.req.param("appId");
  const { startDate: startDateStr, endDate: endDateStr } = c.req.query();

  const startDate = startDateStr ? new Date(startDateStr) : undefined;
  const endDate = endDateStr ? new Date(endDateStr) : undefined;

  console.log(`Received request for appId: ${appId}`);

  try {
    const chartData = await runLtvBatchProcess(appId, startDate, endDate);

    return c.json({
      success: true,
      appId: appId,
      chartData: chartData,
    });
  } catch (error) {
    console.error(
      `[Error] Failed to process LTV data for appId ${appId}:`,
      error
    );

    return c.json(
      {
        success: false,
        appId: appId,
        message: "An internal server error occurred.",
        chartData: [],
      },
      500
    );
  }
});

// デバッグ用ルーティングを設定
app.route("/debug", debug);

// チャット関連のルーティングを設定
app.route("/api/chat", chatRouter);

// ポート番号の設定（環境変数またはデフォルト3000）
const port = parseInt(process.env.PORT || "3000");

serve(
  {
    fetch: app.fetch,
    port: port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
