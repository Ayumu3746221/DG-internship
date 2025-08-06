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
        console.log('\n=== AI CHAT START REQUEST ===');
        // リクエストボディからappIdとperiodを取得
        const { appId, period } = await c.req.json();
        console.log(`📥 Request params: appId=${appId}, period=${period}`);
        let comprehensiveData = null;
        // appIdが提供されている場合、すべてのデータタイプを取得
        if (appId) {
            try {
                console.log('🔄 Starting parallel data fetch...');
                // 並行してすべてのデータを取得
                const [ltvData, revenueData, demographicsData] = await Promise.all([
                    getLtvData(appId, period),
                    getRevenueData(appId),
                    getDemographicsData(appId)
                ]);
                console.log('✅ Data fetch completed');
                console.log(`📊 LTV Data: ${ltvData ? 'SUCCESS' : 'NULL'}`);
                console.log(`📈 Revenue Data: ${revenueData ? 'SUCCESS' : 'NULL'}`);
                console.log(`👥 Demographics Data: ${demographicsData ? 'SUCCESS' : 'NULL'}`);
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
                console.log('📋 COMPREHENSIVE DATA SUMMARY:');
                console.log(`🎯 AppID: ${appId}`);
                console.log(`📅 Selected Period: ${period || 'All'}`);
                console.log(`📊 LTV Months: ${ltvData?.ltvData?.length || 0}`);
                console.log(`📈 Revenue Data Points: Week(${revenueData?.weekData?.length || 0}), Month(${revenueData?.monthData?.length || 0}), Year(${revenueData?.yearData?.length || 0})`);
                console.log(`👥 Demographics: ${demographicsData?.totalUsers || 0} users, ${demographicsData?.summary?.mainGender || "不明"} majority`);
                console.log(`💰 Key Metrics: LTV High Avg=${ltvData?.summary?.avgHigh || 0}, Total Revenue=${demographicsData?.totalRevenue || 0}`);
            }
            catch (error) {
                console.error('❌ FAILED to fetch comprehensive data:', error);
                console.error('🔄 Will continue with default data');
                // データの取得に失敗した場合もデフォルトデータで続行
            }
        }
        else {
            console.log('⚠️  No appId provided, using default data');
        }
        // 新しいGeminiサービスインスタンスを作成（全データを渡す）
        console.log('🤖 Creating Gemini service instance...');
        geminiService = new GeminiService(comprehensiveData);
        console.log('✅ Gemini service created');
        // AIチャットセッションを初期化（経営データを送信）
        console.log('🔄 Initializing AI chat session...');
        await geminiService.initializeChat();
        console.log('✅ AI chat session initialized');
        // 初期分析を取得
        console.log('📝 Requesting initial analysis from AI...');
        const analysis = await geminiService.getInitialAnalysis();
        console.log('✅ Initial analysis received');
        console.log(`📄 Analysis length: ${analysis?.length || 0} characters`);
        console.log('✅ AI CHAT START SUCCESS');
        console.log('=== END AI CHAT START ===\n');
        return c.json({ success: true, data: { analysis } });
    }
    catch (error) {
        console.error('❌ AI CHAT START ERROR:', error);
        console.error('🔍 Error details:', {
            message: error.message,
            status: error.status,
            stack: error.stack?.substring(0, 500)
        });
        // エラーメッセージをクライアントに返す
        let errorMessage = 'チャットの開始に失敗しました。';
        if (error.status === 503) {
            errorMessage = 'AIサービスが一時的に利用できません。しばらくしてからもう一度お試しください。';
        }
        else if (error.message) {
            errorMessage += ` ${error.message}`;
        }
        console.log('❌ AI CHAT START FAILED');
        console.log('=== END AI CHAT START ===\n');
        return c.json({
            success: false,
            error: errorMessage,
            details: error.status || 500
        }, error.status || 500);
    }
});
// LTVデータを取得するヘルパー関数
// 注意: periodパラメータに関係なく、常に12ヶ月の月次平均データを取得
async function getLtvData(appId, period) {
    try {
        console.log(`📊 [LTV] Fetching data for appId: ${appId}, period: ${period || 'All'}`);
        const { runMonthlyLtvProcess } = await import("../../services/runMonthlyLtvProcess.js");
        // periodに関係なく、常に全期間（12ヶ月）のデータを取得
        // デフォルトで2024年の全期間を指定（runMonthlyLtvProcessのデフォルト値）
        const monthlyLtvData = await runMonthlyLtvProcess(appId);
        console.log(`📊 [LTV] Raw data received: ${monthlyLtvData.length} months`);
        const result = {
            ltvData: monthlyLtvData,
            period: period || "全期間", // フロントエンドで選択された期間情報を保持（参考用）
            summary: {
                totalMonths: monthlyLtvData.length,
                avgHigh: Math.round(monthlyLtvData.reduce((sum, item) => sum + item.high, 0) / monthlyLtvData.length || 0),
                avgMiddle: Math.round(monthlyLtvData.reduce((sum, item) => sum + item.middle, 0) / monthlyLtvData.length || 0),
                avgLow: Math.round(monthlyLtvData.reduce((sum, item) => sum + item.low, 0) / monthlyLtvData.length || 0),
            }
        };
        console.log(`📊 [LTV] Processed data: ${result.summary.totalMonths} months, Avg High: ${result.summary.avgHigh}`);
        return result;
    }
    catch (error) {
        console.error('❌ [LTV] Failed to fetch LTV data:', error);
        return null;
    }
}
// 売上推移データを取得するヘルパー関数
async function getRevenueData(appId) {
    try {
        console.log(`📈 [REVENUE] Fetching data for appId: ${appId}`);
        const { runRevenueProcess } = await import("../../services/runRevenueProcess.js");
        const result = await runRevenueProcess(appId);
        console.log(`📈 [REVENUE] Data received: Week(${result?.weekData?.length || 0}), Month(${result?.monthData?.length || 0}), Year(${result?.yearData?.length || 0})`);
        console.log(`📈 [REVENUE] Revenue totals: Week=${result?.summary?.weekTotal || 0}, Month=${result?.summary?.monthTotal || 0}, Year=${result?.summary?.yearTotal || 0}`);
        return result;
    }
    catch (error) {
        console.error('❌ [REVENUE] Failed to fetch revenue data:', error);
        return null;
    }
}
// 顧客属性データを取得するヘルパー関数
async function getDemographicsData(appId) {
    try {
        console.log(`👥 [DEMOGRAPHICS] Fetching data for appId: ${appId}`);
        const { runDemographicsProcess } = await import("../../services/runDemographicsProcess.js");
        const result = await runDemographicsProcess(appId);
        console.log(`👥 [DEMOGRAPHICS] Data received: ${result?.totalUsers || 0} users, ${result?.summary?.mainGender || 'Unknown'} majority`);
        console.log(`👥 [DEMOGRAPHICS] Age groups: ${Object.keys(result?.ageGroups || {}).length}, Prefectures: ${Object.keys(result?.prefectures || {}).length}`);
        console.log(`👥 [DEMOGRAPHICS] Total Revenue: ${result?.totalRevenue || 0}, Top Region: ${result?.summary?.topRegion || 'Unknown'}`);
        return result;
    }
    catch (error) {
        console.error('❌ [DEMOGRAPHICS] Failed to fetch demographics data:', error);
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
        console.log('\n=== AI CHAT MESSAGE REQUEST ===');
        // チャットセッションが初期化されているかチェック
        if (!geminiService) {
            console.log('❌ No chat session initialized');
            return c.json({ success: false, error: 'チャットセッションが初期化されていません。先にチャットを開始してください。' }, 400);
        }
        // リクエストボディからメッセージを取得
        const { message } = await c.req.json();
        console.log(`📥 User message received: "${message?.substring(0, 100)}${message?.length > 100 ? '...' : ''}"`);
        // メッセージの必須チェック
        if (!message) {
            console.log('❌ Empty message received');
            return c.json({ success: false, error: 'メッセージが必要です。' }, 400);
        }
        // AIにメッセージを送信してレスポンスを取得
        console.log('🔄 Sending message to AI...');
        const response = await geminiService.sendMessage(message);
        console.log(`✅ AI response received: ${response?.length || 0} characters`);
        console.log(`📤 Response preview: "${response?.substring(0, 200)}${response?.length > 200 ? '...' : ''}"`);
        console.log('✅ AI CHAT MESSAGE SUCCESS');
        console.log('=== END AI CHAT MESSAGE ===\n');
        return c.json({ success: true, data: { response } });
    }
    catch (error) {
        console.error('❌ AI CHAT MESSAGE ERROR:', error);
        console.error('🔍 Error details:', {
            message: error.message,
            status: error.status,
            stack: error.stack?.substring(0, 300)
        });
        // エラーメッセージをクライアントに返す
        let errorMessage = 'メッセージの処理に失敗しました。';
        if (error.status === 503) {
            errorMessage = 'AIサービスが一時的に利用できません。しばらくしてからもう一度お試しください。';
        }
        else if (error.message) {
            errorMessage += ` ${error.message}`;
        }
        console.log('❌ AI CHAT MESSAGE FAILED');
        console.log('=== END AI CHAT MESSAGE ===\n');
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
