import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, ArrowLeft, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { chatAPI } from '../services/api';

/**
 * チャットページコンポーネント
 * AI分析チャット機能のメイン画面
 */
const ChatPage = () => {
  // 状態管理
  const [messages, setMessages] = useState([]);           // チャットメッセージリスト
  const [inputMessage, setInputMessage] = useState('');   // 入力中のメッセージ
  const [isLoading, setIsLoading] = useState(false);      // API通信中フラグ
  const [chatStarted, setChatStarted] = useState(false);  // チャット開始済みフラグ
  const messagesEndRef = useRef(null);                    // メッセージ最下部の参照

  // メッセージリストが更新されたら自動スクロール
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * チャット画面の最下部にスクロール
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * チャットセッション開始処理
   * バックエンドに経営データを送信し、AI分析を開始
   */
  const startChat = async () => {
    try {
      setIsLoading(true);
      
      // チャット開始API呼び出し
      const response = await chatAPI.startChat();
      
      if (response.success) {
        setChatStarted(true);
        // AIからの初期分析をメッセージリストに追加
        setMessages([
          {
            id: Date.now(),
            type: 'ai',
            content: response.data.analysis,
            timestamp: new Date().toLocaleTimeString('ja-JP')
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to start chat:', error);
      // エラー時のメッセージを表示
      setMessages([
        {
          id: Date.now(),
          type: 'ai',
          content: '申し訳ございません。チャットの開始に失敗しました。',
          timestamp: new Date().toLocaleTimeString('ja-JP')
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * メッセージ送信処理
   * ユーザーの入力をAIに送信し、レスポンスを取得
   */
  const handleSendMessage = async () => {
    // 入力チェック：空白、読み込み中、チャット未開始の場合は処理しない
    if (!inputMessage.trim() || isLoading || !chatStarted) return;

    // ユーザーメッセージをメッセージリストに追加
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('ja-JP')
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage(''); // 入力フィールドをクリア
    setIsLoading(true);

    try {
      // AIにメッセージを送信
      const response = await chatAPI.sendMessage(inputMessage);
      
      if (response.success) {
        // AIからのレスポンスをメッセージリストに追加
        const aiMessage = {
          id: crypto.randomUUID(),
          type: 'ai',
          content: response.data.response,
          timestamp: new Date().toLocaleTimeString('ja-JP')
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // エラー時のメッセージを表示
      const errorMessage = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: 'メッセージの送信に失敗しました。もう一度お試しください。',
        timestamp: new Date().toLocaleTimeString('ja-JP')
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * キーボードイベント処理
   * Enterキーでメッセージ送信（Shift+Enterは改行）
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * チャットリセット処理
   * セッションをリセットして新しいチャットを開始可能にする
   */
  const resetChat = async () => {
    try {
      await chatAPI.resetChat();
      setMessages([]);
      setChatStarted(false);
      setInputMessage('');
    } catch (error) {
      console.error('Failed to reset chat:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー：ナビゲーションとタイトル */}
      <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* ホームに戻るボタン */}
          <Link
            to="/"
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition"
            title="ホームに戻る"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          {/* タイトル */}
          <Bot className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-xl font-semibold text-gray-800">経営レポートAIアシスタント</h1>
        </div>
        {/* チャットリセットボタン（チャット開始後に表示） */}
        {chatStarted && (
          <button
            onClick={resetChat}
            className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
          >
            チャットをリセット
          </button>
        )}
      </div>

      {/* チャット未開始時：開始画面 */}
      {!chatStarted ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Bot className="w-24 h-24 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              AI分析を開始
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
              経営データをAIに送信し、分析を開始します。<br />
              AIが初期分析を提供した後、質問できるようになります。
            </p>
            {/* チャット開始ボタン */}
            <button
              onClick={startChat}
              disabled={isLoading}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <Play className="w-6 h-6 mr-2" />
              {isLoading ? '初期化中...' : 'チャットを開始'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* チャット開始後：メッセージ表示エリア */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* メッセージリストのレンダリング */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl flex ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  } items-start space-x-3`}
                >
                  {/* メッセージ送信者のアイコン */}
                  <div
                    className={`p-2 rounded-full flex-shrink-0 ${
                      message.type === 'user' ? 'bg-blue-600 ml-3' : 'bg-gray-300 mr-3'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-gray-700" />
                    )}
                  </div>
                  {/* メッセージ内容 */}
                  <div
                    className={`px-4 py-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* 読み込み中表示 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-gray-300">
                    <Bot className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="px-4 py-3 rounded-lg bg-white border border-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 自動スクロール用の要素 */}
            <div ref={messagesEndRef} />
          </div>

          {/* メッセージ入力エリア */}
          <div className="bg-white border-t px-6 py-4">
            <div className="flex space-x-4 max-w-4xl mx-auto">
              {/* メッセージ入力フィールド */}
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="経営について質問してください..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                disabled={isLoading || !chatStarted}
              />
              {/* 送信ボタン */}
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading || !chatStarted}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center min-w-[100px]"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;