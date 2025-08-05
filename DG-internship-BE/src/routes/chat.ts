import { Hono } from "hono";
import { GeminiService } from "../services/gemini.js";

// チャット関連のルーター
const chatRouter = new Hono();

// Geminiサービスのインスタンス（セッション管理用）
let geminiService: GeminiService | null = null;

/**
 * チャットセッション開始エンドポイント
 * - 新しいGeminiServiceインスタンスを作成
 * - 経営データをAIに送信して初期化
 * - 初期分析を取得して返す
 */
chatRouter.post("/start", async (c) => {
  try {
    // 新しいGeminiサービスインスタンスを作成
    geminiService = new GeminiService();

    // AIチャットセッションを初期化（経営データを送信）
    await geminiService.initializeChat();

    // 初期分析を取得
    const analysis = await geminiService.getInitialAnalysis();

    return c.json({ success: true, data: { analysis } });
  } catch (error) {
    console.error("Start chat error:", error);
    return c.json(
      { success: false, error: "Failed to start chat session" },
      500
    );
  }
});

/**
 * メッセージ送信エンドポイント
 * - チャットセッションが開始されているかチェック
 * - ユーザーメッセージをAIに送信
 * - AIレスポンスを返す
 */
chatRouter.post("/message", async (c) => {
  try {
    // チャットセッションが初期化されているかチェック
    if (!geminiService) {
      return c.json(
        {
          success: false,
          error: "Chat session not initialized. Please start a chat first.",
        },
        400
      );
    }

    // リクエストボディからメッセージを取得
    const { message } = await c.req.json();

    // メッセージの必須チェック
    if (!message) {
      return c.json({ success: false, error: "Message is required" }, 400);
    }

    // AIにメッセージを送信してレスポンスを取得
    const response = await geminiService.sendMessage(message);

    return c.json({ success: true, data: { response } });
  } catch (error) {
    console.error("Chat error:", error);
    return c.json({ success: false, error: "Failed to process message" }, 500);
  }
});

/**
 * チャットセッションリセットエンドポイント
 * - 現在のGeminiServiceインスタンスを破棄
 * - 新しいチャット開始に備える
 */
chatRouter.post("/reset", async (c) => {
  try {
    // Geminiサービスインスタンスをリセット
    geminiService = null;

    return c.json({
      success: true,
      message: "Chat session reset successfully",
    });
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to reset chat session" },
      500
    );
  }
});

export default chatRouter;
