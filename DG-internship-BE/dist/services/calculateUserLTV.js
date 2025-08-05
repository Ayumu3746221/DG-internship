/**
 * 平均購入単価 (APV: Average Purchase Value) を計算する
 */
function calculateAPV(transactions) {
    if (transactions.length === 0) {
        return 0;
    }
    const totalAmount = transactions.reduce((sum, t) => sum + t.price, 0);
    return totalAmount / transactions.length;
}
/**
 * 月間購入頻度を計算する（修正版）
 */
function calculateMonthlyFrequency(transactions, snapshotDate) {
    if (transactions.length === 0) {
        return 0;
    }
    // 購入が1回の場合は、月1回の頻度として扱う
    if (transactions.length === 1) {
        return 1;
    }
    // 最初の購入日を特定するために日付でソート
    const sortedTransactions = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstPurchaseDate = sortedTransactions[0].date;
    // 観察期間を日数で計算
    const diffTime = snapshotDate.getTime() - firstPurchaseDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
        return 1; // 当日購入の場合は月1回として扱う
    }
    // 最低でも1日は経過しているとして計算
    const actualDays = Math.max(diffDays, 1);
    // 1日あたりの購入頻度
    const frequencyPerDay = transactions.length / actualDays;
    // 月間（30日）に換算
    const monthlyFreq = frequencyPerDay * 30;
    // 最低でも月0.1回は購入するとして下限を設定
    return Math.max(monthlyFreq, 0.1);
}
/**
 * あるユーザーの特定時点でのLTVを計算する
 */
export function calculateUserLTV(userTransactions, snapshotDate) {
    // 基準日までの取引履歴にフィルタリング
    const transactionsUpToDate = userTransactions.filter((t) => t.date <= snapshotDate);
    if (transactionsUpToDate.length === 0) {
        return 0;
    }
    // LTVの各指標を計算
    const apv = calculateAPV(transactionsUpToDate);
    const monthlyFrequency = calculateMonthlyFrequency(transactionsUpToDate, snapshotDate);
    // 顧客寿命（継続期間）を仮で12ヶ月（1年）と設定
    const customerLifetimeMonths = 12;
    // LTV = 平均購入単価 × 月間購入頻度 × 顧客寿命（月）
    const ltv = apv * monthlyFrequency * customerLifetimeMonths;
    return ltv;
}
