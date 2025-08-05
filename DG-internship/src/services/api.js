import axios from 'axios';

// バックエンドAPIのベースURL
const API_BASE_URL = 'http://localhost:3000/api';

// Axiosインスタンスの作成と設定
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // クッキー認証を有効にする
});

/**
 * チャット関連のAPI呼び出し
 */
export const chatAPI = {
  /**
   * チャットセッションを開始
   * 経営データをAIに送信し、初期分析を取得
   * @param {string} appId アプリケーションID 
   * @param {string} period 期間
   */
  startChat: async (appId, period) => {
    const response = await api.post('/chat/start', { appId, period });
    return response.data;
  },

  /**
   * ユーザーメッセージをAIに送信
   * @param {string} message ユーザーからのメッセージ
   */
  sendMessage: async (message) => {
    const response = await api.post('/chat/message', { message });
    return response.data;
  },

  /**
   * チャットセッションをリセット
   * 新しいチャット開始に備えてセッションを初期化
   */
  resetChat: async () => {
    const response = await api.post('/chat/reset');
    return response.data;
  },
};

export default api;