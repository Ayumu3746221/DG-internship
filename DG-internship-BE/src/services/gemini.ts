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
  private comprehensiveData: any;    // 包括的データ（LTV + 売上推移 + 顧客属性）

  constructor(comprehensiveData: any = null) {
    // Gemini 1.5 Flashモデルを使用（より安定）
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    this.comprehensiveData = comprehensiveData || businessData; // 包括的データまたはデフォルトデータを使用
  }

  /**
   * チャットセッションを初期化
   * 包括的な経営データをAIに送信してコンテキストを設定
   */
  async initializeChat() {
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

    // チャットセッションの開始と設定
    this.chatSession = this.model.startChat({
      generationConfig: {
        temperature: 0.7,      // 回答の創造性レベル
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

    const prompt = `
    提供された包括的データ（LTV、売上推移、顧客属性）をもとに、ゲーム運営に詳しくないお客様にも分かりやすく、以下の点について丁寧に解説してください：

    ## 📊 横断的データ分析レポート

    1. **全体的な業績の評価**
       - LTVトレンドと売上推移の相関関係
       - 期間別（週次/月次/年次）売上パフォーマンス
       - 顧客セグメント別の収益貢献度

    2. **注目すべきポジティブなポイント**
       - 高LTVユーザー層の特徴（年齢、性別、地域）
       - 売上好調な期間と顧客属性の関係
       - 地域別・属性別の成長機会

    3. **課題や改善が求められる点**
       - LTV低下セグメントの分析
       - 売上低迷期間の顧客行動パターン
       - 離脱リスクの高い顧客属性

    4. **今後の運営戦略に向けた具体的な提案**
       - 属性別ターゲティング戦略
       - 期間別プロモーション施策
       - LTV向上のための顧客セグメント別アプローチ
       - 地域特性を活かした展開戦略

    ※各項目に実際のデータに基づく具体的な数値や傾向を必ず含めてください。
    `;
    

    // リトライロジックを実装
    let retries = 3;
    let lastError;
    
    while (retries > 0) {
      try {
        // AIに分析を依頼
        const result = await this.chatSession.sendMessage(prompt);
        return result.response.text();
      } catch (error: any) {
        lastError = error;
        
        // 503エラー（過負荷）の場合は少し待機してリトライ
        if (error.status === 503) {
          retries--;
          if (retries > 0) {
            // 1秒待機してからリトライ
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
        }
        
        // その他のエラーはそのままスロー
        throw error;
      }
    }
    
    // すべてのリトライが失敗した場合
    throw lastError;
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

    // リトライロジックを実装
    let retries = 3;
    let lastError;
    
    while (retries > 0) {
      try {
        // メッセージをAIに送信してレスポンスを取得
        const result = await this.chatSession.sendMessage(message);
        return result.response.text();
      } catch (error: any) {
        lastError = error;
        
        // 503エラー（過負荷）の場合は少し待機してリトライ
        if (error.status === 503) {
          retries--;
          if (retries > 0) {
            // 1秒待機してからリトライ
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
        }
        
        // その他のエラーはそのままスロー
        throw error;
      }
    }
    
    // すべてのリトライが失敗した場合
    throw lastError;
  }
}