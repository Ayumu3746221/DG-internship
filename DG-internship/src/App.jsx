import "./App.css";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SalesChart } from "@/components/SalesChart" // 作成したグラフコンポーネントをインポート

function App() {
  return (
    <div className="bg-background text-foreground flex justify-center items-center h-screen p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>売上ダッシュボード</CardTitle>
          <CardDescription>月別の合計購入金額の推移です。</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesChart />
        </CardContent>
      </Card>
    </div>
  )
}

export default App
