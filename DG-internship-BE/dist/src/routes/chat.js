import { Hono } from "hono";
import { GeminiService } from "../services/gemini.js";
// チャット関連のルーター
const chatRouter = new Hono();
// Geminiサービスのインスタンス（セッション管理用）
let geminiService = null;
/**
 * チャットセッション開始エンドポイント
 * - 新しいGeminiServiceインスタンスを作成
 * - 経営データをAIに送信して初期化
 * - 初期分析を取得して返す
 */
chatRouter.post("/start", async (c) => {
    try {
        // リクエストボディからappIdとperiodを取得
        const { appId, period } = await c.req.json();
        let comprehensiveData = null;
        // appIdが提供されている場合、すべてのデータタイプを取得
        if (appId) {
            try {
                // 並行してすべてのデータを取得
                const [ltvData, revenueData, demographicsData] = await Promise.all([
                    getLtvData(appId, period),
                    getRevenueData(appId),
                    getDemographicsData(appId)
                ]);
                comprehensiveData = {
                    appId: appId,
                    period: period || "全期間",
                    dataTypes: {
                        ltv: ltvData,
                        revenue: revenueData,
                        demographics: demographicsData
                    },
                    summary: {
                        totalDataPoints: {
                            ltvMonths: ltvData?.ltvData?.length || 0,
                            revenueWeeks: revenueData?.weekData?.length || 0,
                            revenueMonths: revenueData?.monthData?.length || 0,
                            revenueYears: revenueData?.yearData?.length || 0,
                            totalUsers: demographicsData?.totalUsers || 0
                        },
                        keyMetrics: {
                            avgLtvHigh: ltvData?.summary?.avgHigh || 0,
                            weeklyRevenue: revenueData?.summary?.weekTotal || 0,
                            monthlyRevenue: revenueData?.summary?.monthTotal || 0,
                            yearlyRevenue: revenueData?.summary?.yearTotal || 0,
                            totalRevenue: demographicsData?.totalRevenue || 0,
                            mainDemographic: {
                                gender: demographicsData?.summary?.mainGender || "不明",
                                ageGroup: demographicsData?.summary?.mainAgeGroup || "不明",
                                region: demographicsData?.summary?.topRegion || "不明"
                            }
                        }
                    }
                };
                console.log(`Retrieved comprehensive data for appId: ${appId}`);
                console.log(`- LTV months: ${ltvData?.ltvData?.length || 0}`);
                console.log(`- Revenue periods: Week(${revenueData?.weekData?.length || 0}), Month(${revenueData?.monthData?.length || 0}), Year(${revenueData?.yearData?.length || 0})`);
                console.log(`- Demographics: ${demographicsData?.totalUsers || 0} users, ${demographicsData?.summary?.mainGender || "不明"} majority`);
            }
            catch (error) {
                console.error('Failed to fetch comprehensive data:', error);
                // データの取得に失敗した場合もデフォルトデータで続行
            }
        }
        // 新しいGeminiサービスインスタンスを作成（全データを渡す）
        geminiService = new GeminiService(comprehensiveData);
        // AIチャットセッションを初期化（経営データを送信）
        await geminiService.initializeChat();
        // 初期分析を取得
        const analysis = await geminiService.getInitialAnalysis();
        return c.json({ success: true, data: { analysis } });
    }
    catch (error) {
        console.error('Start chat error:', error);
        // エラーメッセージをクライアントに返す
        let errorMessage = 'チャットの開始に失敗しました。';
        if (error.status === 503) {
            errorMessage = 'AIサービスが一時的に利用できません。しばらくしてからもう一度お試しください。';
        }
        else if (error.message) {
            errorMessage += ` ${error.message}`;
        }
        return c.json({
            success: false,
            error: errorMessage,
            details: error.status || 500
        }, error.status || 500);
    }
});
// LTVデータを取得するヘルパー関数
async function getLtvData(appId, period) {
    try {
        const { runMonthlyLtvProcess } = await import("../../services/runMonthlyLtvProcess.js");
        // 期間の解析（例: "2024-01" または "2024" または undefined）
        let startDate, endDate;
        if (period) {
            if (period.length === 4) { // 年のみ（例: "2024"）
                startDate = new Date(`${period}-01-01`);
                endDate = new Date(`${period}-12-31`);
            }
            else if (period.length === 7) { // 年月（例: "2024-01"）
                const year = period.substring(0, 4);
                const month = period.substring(5, 7);
                startDate = new Date(`${period}-01`);
                endDate = new Date(parseInt(year), parseInt(month), 0); // 月末
            }
        }
        // 月次LTVデータを取得
        const monthlyLtvData = await runMonthlyLtvProcess(appId, startDate, endDate);
        return {
            ltvData: monthlyLtvData,
            summary: {
                totalMonths: monthlyLtvData.length,
                avgHigh: Math.round(monthlyLtvData.reduce((sum, item) => sum + item.high, 0) / monthlyLtvData.length || 0),
                avgMiddle: Math.round(monthlyLtvData.reduce((sum, item) => sum + item.middle, 0) / monthlyLtvData.length || 0),
                avgLow: Math.round(monthlyLtvData.reduce((sum, item) => sum + item.low, 0) / monthlyLtvData.length || 0),
            }
        };
    }
    catch (error) {
        console.error('Failed to fetch LTV data:', error);
        return null;
    }
}
// 売上推移データを取得するヘルパー関数
async function getRevenueData(appId) {
    try {
        const { runRevenueProcess } = await import("../../services/runRevenueProcess.js");
        return await runRevenueProcess(appId);
    }
    catch (error) {
        console.error('Failed to fetch revenue data:', error);
        return null;
    }
}
// 顧客属性データを取得するヘルパー関数
async function getDemographicsData(appId) {
    try {
        const { runDemographicsProcess } = await import("../../services/runDemographicsProcess.js");
        return await runDemographicsProcess(appId);
    }
    catch (error) {
        console.error('Failed to fetch demographics data:', error);
        return null;
    }
}
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
            return c.json({ success: false, error: 'チャットセッションが初期化されていません。先にチャットを開始してください。' }, 400);
        }
        // リクエストボディからメッセージを取得
        const { message } = await c.req.json();
        // メッセージの必須チェック
        if (!message) {
            return c.json({ success: false, error: 'メッセージが必要です。' }, 400);
        }
        // AIにメッセージを送信してレスポンスを取得
        const response = await geminiService.sendMessage(message);
        return c.json({ success: true, data: { response } });
    }
    catch (error) {
        console.error('Chat error:', error);
        // エラーメッセージをクライアントに返す
        let errorMessage = 'メッセージの処理に失敗しました。';
        if (error.status === 503) {
            errorMessage = 'AIサービスが一時的に利用できません。しばらくしてからもう一度お試しください。';
        }
        else if (error.message) {
            errorMessage += ` ${error.message}`;
        }
        return c.json({
            success: false,
            error: errorMessage,
            details: error.status || 500
        }, error.status || 500);
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
    }
    catch (error) {
        return c.json({ success: false, error: "Failed to reset chat session" }, 500);
    }
});
export default chatRouter;
