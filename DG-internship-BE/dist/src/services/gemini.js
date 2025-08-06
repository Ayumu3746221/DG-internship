import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
// 環境変数の読み込み
dotenv.config();
// Google Generative AIのインスタンス作成
if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
/**
 * 模擬経営データ - 包括的なゲームアプリ運営データ
 * LTV、売上推移、顧客属性の3つのデータタイプを含む
 */
export const businessData = {
    appId: "app_0005",
    period: "全期間",
    dataTypes: {
        // LTVデータ（月次推移）
        ltv: {
            ltvData: [
                { month: "2024-01", high: 8500, middle: 4200, low: 1500 },
                { month: "2024-02", high: 8800, middle: 4500, low: 1600 },
                { month: "2024-03", high: 9200, middle: 4800, low: 1800 },
                { month: "2024-04", high: 9500, middle: 5000, low: 1900 },
                { month: "2024-05", high: 9800, middle: 5200, low: 2000 },
                { month: "2024-06", high: 10200, middle: 5500, low: 2100 },
                { month: "2024-07", high: 10500, middle: 5800, low: 2200 },
                { month: "2024-08", high: 10800, middle: 6000, low: 2300 },
                { month: "2024-09", high: 11000, middle: 6200, low: 2400 },
                { month: "2024-10", high: 11200, middle: 6400, low: 2500 },
                { month: "2024-11", high: 11500, middle: 6600, low: 2600 },
                { month: "2024-12", high: 11800, middle: 6800, low: 2700 }
            ],
            period: "全期間",
            summary: {
                totalMonths: 12,
                avgHigh: 10175,
                avgMiddle: 5608,
                avgLow: 2133
            }
        },
        // 売上推移データ（週・月・年）
        revenue: {
            weekData: [
                { period: "1week", label: "12/25", sales: 850000, orderCount: 120, dateKey: "2024-12-25" },
                { period: "1week", label: "12/26", sales: 920000, orderCount: 135, dateKey: "2024-12-26" },
                { period: "1week", label: "12/27", sales: 980000, orderCount: 142, dateKey: "2024-12-27" },
                { period: "1week", label: "12/28", sales: 1050000, orderCount: 155, dateKey: "2024-12-28" },
                { period: "1week", label: "12/29", sales: 1120000, orderCount: 168, dateKey: "2024-12-29" },
                { period: "1week", label: "12/30", sales: 1180000, orderCount: 175, dateKey: "2024-12-30" },
                { period: "1week", label: "12/31", sales: 1250000, orderCount: 185, dateKey: "2024-12-31" }
            ],
            monthData: [
                { period: "1month", label: "12/1", sales: 820000, orderCount: 115, dateKey: "2024-12-01" },
                { period: "1month", label: "12/5", sales: 850000, orderCount: 120, dateKey: "2024-12-05" },
                { period: "1month", label: "12/10", sales: 900000, orderCount: 128, dateKey: "2024-12-10" },
                { period: "1month", label: "12/15", sales: 950000, orderCount: 135, dateKey: "2024-12-15" },
                { period: "1month", label: "12/20", sales: 1000000, orderCount: 145, dateKey: "2024-12-20" },
                { period: "1month", label: "12/25", sales: 1050000, orderCount: 155, dateKey: "2024-12-25" },
                { period: "1month", label: "12/31", sales: 1250000, orderCount: 185, dateKey: "2024-12-31" }
            ],
            yearData: [
                { period: "1year", label: "1月", sales: 8500000, orderCount: 1200, dateKey: "2024-01" },
                { period: "1year", label: "2月", sales: 8800000, orderCount: 1250, dateKey: "2024-02" },
                { period: "1year", label: "3月", sales: 9200000, orderCount: 1320, dateKey: "2024-03" },
                { period: "1year", label: "4月", sales: 9500000, orderCount: 1380, dateKey: "2024-04" },
                { period: "1year", label: "5月", sales: 9800000, orderCount: 1420, dateKey: "2024-05" },
                { period: "1year", label: "6月", sales: 10200000, orderCount: 1480, dateKey: "2024-06" },
                { period: "1year", label: "7月", sales: 10500000, orderCount: 1520, dateKey: "2024-07" },
                { period: "1year", label: "8月", sales: 10800000, orderCount: 1580, dateKey: "2024-08" },
                { period: "1year", label: "9月", sales: 11000000, orderCount: 1620, dateKey: "2024-09" },
                { period: "1year", label: "10月", sales: 11200000, orderCount: 1680, dateKey: "2024-10" },
                { period: "1year", label: "11月", sales: 11500000, orderCount: 1720, dateKey: "2024-11" },
                { period: "1year", label: "12月", sales: 11800000, orderCount: 1780, dateKey: "2024-12" }
            ],
            summary: {
                weekTotal: 7350000,
                monthTotal: 6820000,
                yearTotal: 123000000,
                avgWeekly: 1050000,
                avgMonthly: 974286,
                avgYearly: 10250000
            }
        },
        // 顧客属性データ
        demographics: {
            genderRatio: {
                male: 3200,
                female: 2800,
                malePercentage: 53,
                femalePercentage: 47
            },
            ageGroups: {
                "10代": { count: 800, revenue: 5600000, percentage: 5 },
                "20代": { count: 2200, revenue: 35200000, percentage: 29 },
                "30代": { count: 1800, revenue: 43200000, percentage: 35 },
                "40代": { count: 900, revenue: 27000000, percentage: 22 },
                "50代+": { count: 300, revenue: 12000000, percentage: 9 }
            },
            prefectures: {
                "東京都": { count: 1800, revenue: 36900000, percentage: 30 },
                "大阪府": { count: 900, revenue: 17220000, percentage: 14 },
                "神奈川県": { count: 600, revenue: 11070000, percentage: 9 },
                "愛知県": { count: 450, revenue: 8610000, percentage: 7 },
                "福岡県": { count: 300, revenue: 6150000, percentage: 5 },
                "その他": { count: 1950, revenue: 43050000, percentage: 35 }
            },
            topPrefectures: [
                { name: "東京都", percentage: 30, revenue: 36900000 },
                { name: "大阪府", percentage: 14, revenue: 17220000 },
                { name: "神奈川県", percentage: 9, revenue: 11070000 }
            ],
            totalRevenue: 123000000,
            totalUsers: 6000,
            summary: {
                mainAgeGroup: "30代",
                mainGender: "男性",
                topRegion: "東京都",
                avgRevenuePerUser: 20500
            }
        }
    },
    summary: {
        totalDataPoints: {
            ltvMonths: 12,
            revenueWeeks: 7,
            revenueMonths: 7,
            revenueYears: 12,
            totalUsers: 6000
        },
        keyMetrics: {
            avgLtvHigh: 10175,
            weeklyRevenue: 7350000,
            monthlyRevenue: 6820000,
            yearlyRevenue: 123000000,
            totalRevenue: 123000000,
            mainDemographic: {
                gender: "男性",
                ageGroup: "30代",
                region: "東京都"
            }
        }
    }
};
/**
 * Gemini AIサービスクラス
 * チャットセッションの管理とAIとの対話を担当
 */
export class GeminiService {
    model; // Geminiモデルインスタンス
    chatSession; // チャットセッション
    comprehensiveData; // 包括的データ（LTV + 売上推移 + 顧客属性）
    constructor(comprehensiveData = null) {
        console.log('🤖 [GEMINI] Constructing Gemini service...');
        // Gemini 1.5 Flashモデルを使用（より安定）
        this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        this.comprehensiveData = comprehensiveData || businessData; // 包括的データまたはデフォルトデータを使用
        console.log(`🤖 [GEMINI] Using ${comprehensiveData ? 'REAL' : 'DEFAULT'} data`);
        console.log(`🤖 [GEMINI] Model: gemini-1.5-flash`);
        if (comprehensiveData) {
            console.log(`🤖 [GEMINI] Data types available: ${Object.keys(comprehensiveData.dataTypes || {}).join(', ')}`);
        }
    }
    /**
     * チャットセッションを初期化
     * 包括的な経営データをAIに送信してコンテキストを設定
     */
    async initializeChat() {
        console.log('🔄 [GEMINI] Initializing chat session...');
        // AIに送信する包括的経営データのコンテキスト
        const reportContext = `
    以下は、あるモバイルゲームアプリに関する包括的な運営データです。
    提供される情報には以下のデータが含まれています：

    1. **LTV（顧客生涯価値）データ**: ユーザーセグメント別の月次推移
    2. **売上推移データ**: 1週間、1ヶ月、1年の期間別売上トレンド  
    3. **顧客属性データ**: 性別、年齢層、地域別の詳細分析

    ※専門用語は避け、初心者にも分かる表現で、小見出しを付けて丁寧に説明してください。
    ※各データタイプを横断的に分析し、相関関係や傾向を見つけてください。

    モバイルゲームアプリに関する包括的運営データ：
    ${JSON.stringify(this.comprehensiveData, null, 2)}
    
    この豊富な情報を基に、データ横断分析を行い、わかりやすく実践的なアドバイスを提供してください。
    `;
        console.log(`📝 [GEMINI] Context length: ${reportContext.length} characters`);
        console.log(`🗂️ [GEMINI] Data summary:`, this.comprehensiveData?.summary || {});
        // データが正しく渡されているか確認
        if (this.comprehensiveData) {
            console.log(`📊 [GEMINI] Data check:`, {
                hasLTV: !!this.comprehensiveData.dataTypes?.ltv,
                hasRevenue: !!this.comprehensiveData.dataTypes?.revenue,
                hasDemographics: !!this.comprehensiveData.dataTypes?.demographics,
                ltvMonths: this.comprehensiveData.dataTypes?.ltv?.ltvData?.length || 0,
                revenueWeekData: this.comprehensiveData.dataTypes?.revenue?.weekData?.length || 0,
            });
        }
        // チャットセッションの開始と設定
        console.log('⚙️ [GEMINI] Setting up chat with config: temp=0.7, maxTokens=3072');
        this.chatSession = this.model.startChat({
            generationConfig: {
                temperature: 0.7, // 回答の創造性レベル
                topK: 1,
                topP: 1,
                maxOutputTokens: 3072, // 最大出力トークン数を増加（より詳細な分析のため）
            },
            history: [
                {
                    role: 'user',
                    parts: [{ text: reportContext }],
                },
                {
                    role: 'model',
                    parts: [{ text: '包括的な経営データを確認しました。LTV、売上推移、顧客属性の全てのデータを横断的に分析し、ご質問にお答えいたします。' }],
                },
            ],
        });
        console.log('✅ [GEMINI] Chat session initialized successfully');
        return this.chatSession;
    }
    /**
     * 初期分析を取得
     * チャット開始時にAIが提供する経営データの初期分析
     */
    async getInitialAnalysis() {
        console.log('📊 [GEMINI] Starting initial analysis generation...');
        // チャットセッションが未初期化の場合は初期化
        if (!this.chatSession) {
            console.log('⚠️ [GEMINI] Chat session not initialized, initializing now...');
            await this.initializeChat();
        }
        const prompt = `
    提供された包括的データ（LTV、売上推移、顧客属性）をもとに、ゲーム運営に詳しくない方にも分かりやすく、以下の点について丁寧に解説してください：

    ## 横断的データ分析レポート

    1. **全体的な業績の評価**
       - LTVトレンドと売上推移の相関関係
       - 期間別（週次・月次・年次）売上パフォーマンス
       - 顧客セグメント別の収益貢献度

    2. **注目すべきポジティブなポイント**
       - LTVが高いユーザー層の特徴（年齢・性別・地域）
       - 売上が好調な期間と顧客属性の関係
       - 地域別・属性別の成長機会

    3. **課題や改善が求められる点**
       - LTVが低下しているセグメントの分析
       - 売上が低迷している期間の顧客行動パターン
       - 離脱リスクが高い顧客属性

    4. **今後の運営戦略に向けた具体的な提案**
       - 属性別ターゲティング戦略
       - 期間別プロモーション施策
       - LTV向上のための顧客セグメント別アプローチ
       - 地域特性を活かした展開戦略

    ※各項目には実際のデータに基づく具体的な数値や傾向を必ず含めてください。
    ※1～4の各項目のタイトルが必ず含まれるようにしてください。
    直接レポートを生成してください。冒頭に「以下は」などの前置きは不要です。
    `;
        console.log(`📤 [GEMINI] Sending initial analysis prompt (${prompt.length} chars)...`);
        // リトライロジックを実装
        let retries = 3;
        let lastError;
        while (retries > 0) {
            try {
                console.log(`🔄 [GEMINI] Attempt ${4 - retries}/3 - Requesting analysis from AI...`);
                // AIに分析を依頼
                const result = await this.chatSession.sendMessage(prompt);
                // デバッグ：結果オブジェクトの詳細を表示
                console.log(`🔍 [GEMINI] Result object:`, {
                    hasResponse: !!result.response,
                    responseType: typeof result.response,
                    responseKeys: result.response ? Object.keys(result.response) : [],
                });
                const response = result.response.text();
                // 空のレスポンスをチェック
                if (!response || response.length === 0) {
                    console.warn(`⚠️ [GEMINI] Empty response received from AI`);
                    console.log(`🔍 [GEMINI] Full result object:`, JSON.stringify(result, null, 2).substring(0, 500));
                }
                console.log(`✅ [GEMINI] Initial analysis received successfully`);
                console.log(`📄 [GEMINI] Response length: ${response.length} characters`);
                console.log(`📖 [GEMINI] Response preview: ${response.substring(0, 300)}...`);
                return response;
            }
            catch (error) {
                lastError = error;
                console.error(`❌ [GEMINI] Attempt ${4 - retries}/3 failed:`, error.message);
                // 503エラー（過負荷）の場合は少し待機してリトライ
                if (error.status === 503) {
                    retries--;
                    if (retries > 0) {
                        console.log(`⏳ [GEMINI] Service overloaded (503), waiting 1s before retry... (${retries} attempts left)`);
                        // 1秒待機してからリトライ
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        continue;
                    }
                }
                // その他のエラーはそのままスロー
                console.error(`💥 [GEMINI] Non-retryable error or retries exhausted`);
                throw error;
            }
        }
        // すべてのリトライが失敗した場合
        console.error(`💥 [GEMINI] All retries failed, throwing last error`);
        throw lastError;
    }
    /**
     * ユーザーメッセージを送信してAIレスポンスを取得
     * @param message ユーザーからのメッセージ
     * @returns AIからの回答
     */
    async sendMessage(message) {
        console.log(`💬 [GEMINI] Processing user message: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`);
        // チャットセッションが未初期化の場合は初期化
        if (!this.chatSession) {
            console.log('⚠️ [GEMINI] Chat session not initialized, initializing now...');
            await this.initializeChat();
        }
        // リトライロジックを実装
        let retries = 3;
        let lastError;
        while (retries > 0) {
            try {
                console.log(`🔄 [GEMINI] Attempt ${4 - retries}/3 - Sending message to AI...`);
                // メッセージをAIに送信してレスポンスを取得
                const result = await this.chatSession.sendMessage(message);
                // デバッグ：結果オブジェクトの詳細を表示
                console.log(`🔍 [GEMINI] Message result object:`, {
                    hasResponse: !!result.response,
                    responseType: typeof result.response,
                    responseKeys: result.response ? Object.keys(result.response) : [],
                });
                const response = result.response.text();
                // 空のレスポンスをチェック
                if (!response || response.length === 0) {
                    console.warn(`⚠️ [GEMINI] Empty response received from AI for message`);
                    console.log(`🔍 [GEMINI] Full result object:`, JSON.stringify(result, null, 2).substring(0, 500));
                }
                console.log(`✅ [GEMINI] Message response received successfully`);
                console.log(`📄 [GEMINI] Response length: ${response.length} characters`);
                console.log(`📖 [GEMINI] Response preview: ${response.substring(0, 300)}...`);
                return response;
            }
            catch (error) {
                lastError = error;
                console.error(`❌ [GEMINI] Attempt ${4 - retries}/3 failed:`, error.message);
                // 503エラー（過負荷）の場合は少し待機してリトライ
                if (error.status === 503) {
                    retries--;
                    if (retries > 0) {
                        console.log(`⏳ [GEMINI] Service overloaded (503), waiting 1s before retry... (${retries} attempts left)`);
                        // 1秒待機してからリトライ
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        continue;
                    }
                }
                // その他のエラーはそのままスロー
                console.error(`💥 [GEMINI] Non-retryable error or retries exhausted`);
                throw error;
            }
        }
        // すべてのリトライが失敗した場合
        console.error(`💥 [GEMINI] All retries failed, throwing last error`);
        throw lastError;
    }
}
