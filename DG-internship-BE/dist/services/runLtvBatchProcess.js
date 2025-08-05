import { fetchAndPrepareData } from "./fetchAndPrepareData.js";
import { calculateUserLTV } from "./calculateUserLTV.js";
import { determineSegment } from "./determineSegment.js";
/**
 * 指定された期間のLTVセグメント別ユーザー数を日次で集計する
 * @param {string} appId - 対象アプリのID
 * @param {Date} [startDate] - 集計開始日
 * @param {Date} [endDate] - 集計終了日
 * @returns {Promise<DailyLtvSnapshot[]>} グラフ描画用のデータ配列
 */
export async function runLtvBatchProcess(appId, startDate = new Date("2024-01-01T00:00:00Z"), endDate = new Date("2024-12-31T23:59:59Z")) {
    // 1. 最初に一度だけ、全ユーザーの取引データを取得・準備する
    const userHistoryMap = await fetchAndPrepareData(appId);
    if (userHistoryMap.size === 0) {
        console.warn("No user data found. Aborting batch process.");
        return [];
    }
    const finalChartData = [];
    // 2. 指定された期間、1日ずつループする（日付のループ）
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        // その日のセグメント別人数をカウントするカウンターを初期化
        const dailyCounts = {
            high: 0,
            middle: 0,
            low: 0,
        };
        // 3. 全ユーザーに対してループする（ユーザーのループ）
        for (const [userId, userTransactions] of userHistoryMap.entries()) {
            // 4. その日の時点でのLTVとセグメントを計算
            const ltv = calculateUserLTV(userTransactions, currentDate);
            const segment = determineSegment(ltv);
            // 5. カウンターをインクリメント
            dailyCounts[segment]++;
        }
        // 6. その日の集計結果を最終データに追加
        finalChartData.push({
            date: currentDate.toISOString().split("T")[0], // YYYY-MM-DD形式で保存
            ...dailyCounts,
        });
        // 次の日に進める
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return finalChartData;
}
