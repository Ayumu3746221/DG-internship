import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import dotenv from 'dotenv'
import chatRouter from './routes/chat.js'

// 環境変数の読み込み
dotenv.config()

// Honoアプリケーションの初期化
const app = new Hono()

// CORS設定：フロントエンドからのアクセスを許可
app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// ルートエンドポイント：APIの状態確認用
app.get('/', (c) => {
  return c.json({ message: 'DG Internship Backend API', version: '1.0.0' })
})

// チャット関連のルーティングを設定
app.route('/api/chat', chatRouter)

// ポート番号の設定（環境変数またはデフォルト3000）
const port = parseInt(process.env.PORT || '3000')

// サーバーの起動
serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
