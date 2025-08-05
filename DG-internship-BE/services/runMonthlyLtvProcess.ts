import { runLtvBatchProcess } from "./runLtvBatchProcess.js";

export type MonthlyLtvSnapshot = {
  month: string; // YYYY-MM format
  high: number;
  middle: number;
  low: number;
};

/**
 * 指定された期間のLTVセグメント別ユーザー数を月次で集計する  
 * 既存のrunLtvBatchProcessを使用して日次データを取得し、月別に集計
 * @param {string} appId - 対象アプリのID
 * @param {Date} [startDate] - 集計開始日
 * @param {Date} [endDate] - 集計終了日
 * @returns {Promise<MonthlyLtvSnapshot[]>} 月次グラフ描画用のデータ配列
 */
export async function runMonthlyLtvProcess(
  appId: string,
  startDate: Date = new Date("2024-01-01T00:00:00Z"),
  endDate: Date = new Date("2024-12-31T23:59:59Z")
): Promise<MonthlyLtvSnapshot[]> {
  // 既存の日次LTVプロセスを実行してデータを取得
  const dailyData = await runLtvBatchProcess(appId, startDate, endDate);
  
  if (dailyData.length === 0) {
    console.warn("No daily LTV data found. Returning empty monthly data.");
    return [];
  }

  // 月別のデータを集計するためのマップ
  const monthlyMap = new Map<string, { high: number; middle: number; low: number; count: number }>();

  // 日次データを月別に集計
  for (const dailySnapshot of dailyData) {
    // YYYY-MM-DD から YYYY-MM を抽出
    const month = dailySnapshot.date.substring(0, 7); // "2024-01-15" -> "2024-01"
    
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { high: 0, middle: 0, low: 0, count: 0 });
    }
    
    const monthData = monthlyMap.get(month)!;
    monthData.high += dailySnapshot.high;
    monthData.middle += dailySnapshot.middle;
    monthData.low += dailySnapshot.low;
    monthData.count++;
  }

  // マップから配列に変換し、月の平均値を計算
  const monthlyData: MonthlyLtvSnapshot[] = [];
  
  for (const [month, data] of monthlyMap.entries()) {
    monthlyData.push({
      month,
      high: Math.round(data.high / data.count), // 月平均を計算
      middle: Math.round(data.middle / data.count),
      low: Math.round(data.low / data.count),
    });
  }

  // 月順でソート
  monthlyData.sort((a, b) => a.month.localeCompare(b.month));
  
  console.log(`Generated monthly LTV data for ${monthlyData.length} months`);
  return monthlyData;
}