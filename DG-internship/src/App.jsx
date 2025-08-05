import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import "./App.css";
import { Dashboard } from './components/layout/Dashboard';

/**
 * メインアプリケーションコンポーネント
 * ルーティング設定を管理
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* ルートパス：ホームページ（データ可視化とチャット選択） */}
          <Route path="/" element={<Dashboard />} />
          
          {/* チャットパス：AI分析チャットページ */}
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App
