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
 * 模擬経営データ
 * 実際のプロジェクトではデータベースや外部APIから取得
 */
export const businessData = {
  period: '2024年第1四半期',           // 報告期間
  revenue: 15000000,                  // 収益（円）
  expenses: 10000000,                 // 経費（円）
  profit: 5000000,                    // 利益（円）
  growth: 15.5,                       // 成長率（%）
  customerCount: 1200,                // 顧客数
  averageOrderValue: 12500,           // 平均注文価値（円）
  conversionRate: 3.2,                // コンバージョン率（%）
  departments: {                      // 部門別データ
    営業部: { performance: 120, budget: 3000000 },
    マーケティング部: { performance: 95, budget: 2000000 },
    開発部: { performance: 110, budget: 4000000 },
    カスタマーサポート: { performance: 105, budget: 1000000 }
  },
  products: {                         // 製品別データ
    主力製品A: { sales: 8000000, units: 500 },
    製品B: { sales: 4000000, units: 800 },
    新製品C: { sales: 3000000, units: 300 }
  },
  marketShare: 12.5,                  // 市場シェア（%）
  employeeCount: 150,                 // 従業員数
  customerSatisfaction: 4.2           // 顧客満足度（5段階評価）
};

/**
 * Gemini AIサービスクラス
 * チャットセッションの管理とAIとの対話を担当
 */
export class GeminiService {
  private model;                      // Geminiモデルインスタンス
  private chatSession: any;          // チャットセッション

  constructor() {
    // Gemini 2.0 Flash Experimentalモデルを使用
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  /**
   * チャットセッションを初期化
   * 経営データをAIに送信してコンテキストを設定
   */
  async initializeChat() {
    // AIに送信する経営データのコンテキスト
    const reportContext = `
    以下は、あるモバイルゲームアプリに関する運営データです。
    提供される情報には、ユーザーのLTV（顧客生涯価値）、一定期間の購入履歴、活発に課金した時間帯と曜日、年齢層、性別、地域などが含まれています。

    ※専門用語は避け、初心者にも分かる表現で、小見出しを付けて丁寧に説明してください。

    モバイルゲームアプリに関する運営データ：
    ${JSON.stringify(businessData, null, 2)}
    
    この情報を基に、わかりやすく、実践的なアドバイスを提供してください。
    `;

    // チャットセッションの開始と設定
    this.chatSession = this.model.startChat({
      generationConfig: {
        temperature: 0.7,      // 回答の創造性レベル
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048, // 最大出力トークン数
      },
      history: [
        {
          role: 'user',
          parts: [{ text: reportContext }],
        },
        {
          role: 'model',
          parts: [{ text: '経営報告を確認しました。このデータを基に、ご質問にお答えいたします。' }],
        },
      ],
    });

    return this.chatSession;
  }

  /**
   * 初期分析を取得
   * チャット開始時にAIが提供する経営データの初期分析
   */
  async getInitialAnalysis(): Promise<string> {
    // チャットセッションが未初期化の場合は初期化
    if (!this.chatSession) {
      await this.initializeChat();
    }

    // 初期分析用のプロンプト

    // 👇ここでは、経営報告の初期分析をAIに依頼するためのプロンプトを定義
    // const prompt = `
    // この経営報告の初期分析を提供してください。以下の点について簡潔に説明してください：
    // 1. 全体的な業績評価
    // 2. 注目すべき良い点
    // 3. 改善が必要な領域
    // 4. 今後の重点施策の提案
    // `;

    const prompt = `
    提供される情報データをもとに、ゲーム運営に詳しくないお客様にも分かりやすく、以下の点について丁寧に解説してください：

    1. 全体的な業績の評価（例：売上傾向、ユーザーの動き）
    2. 注目すべきポジティブなポイント（ユーザー層、時間帯、地域別傾向など）
    3. 課題や改善が求められる点（特定ユーザー層の離脱、収益の弱い時間帯など）
    4. 今後の運営戦略に向けた具体的な提案（例：ターゲット広告、時間帯別イベント、特定エリア向け施策）
    `;

    // AIに分析を依頼
    const result = await this.chatSession.sendMessage(prompt);
    return result.response.text();
  }

  /**
   * ユーザーメッセージを送信してAIレスポンスを取得
   * @param message ユーザーからのメッセージ
   * @returns AIからの回答
   */
  async sendMessage(message: string): Promise<string> {
    // チャットセッションが未初期化の場合は初期化
    if (!this.chatSession) {
      await this.initializeChat();
    }

    // メッセージをAIに送信してレスポンスを取得
    const result = await this.chatSession.sendMessage(message);
    return result.response.text();
  }
}