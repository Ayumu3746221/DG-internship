import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import "./App.css";

/**
 * メインアプリケーションコンポーネント
 * ルーティング設定を管理
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* ルートパス：ホームページ（データ可視化とチャット選択） */}
          <Route path="/" element={<div>Hello World</div>} />
          
          {/* チャットパス：AI分析チャットページ */}
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
