import { serve } from "@hono/node-server";
import { Hono } from "hono";
import debug from "./debugRouter.js";
import { runLtvBatchProcess } from "../services/runLtvBatchProcess.js";

const app = new Hono();

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

// デバッグ用のルーターをマウント
app.route("/api/debug", debug);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
