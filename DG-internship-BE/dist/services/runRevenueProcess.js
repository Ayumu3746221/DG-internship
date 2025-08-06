// 売上推移データを取得・集計するサービス
// SalesChart コンポーネントのロジックを参考に実装
// 期間に基づいて売上データを集計する関数
const aggregateSales = (orders, period) => {
    if (!orders || !Array.isArray(orders))
        return [];
    // 期間フィルタ用の日付を計算
    const endDate = new Date("2024-12-31T23:59:59");
    let startDate = new Date(endDate);
    if (period === "1week") {
        startDate.setDate(endDate.getDate() - 6); // 12/25～12/31の7日間
    }
    else if (period === "1month") {
        startDate.setMonth(endDate.getMonth() - 1); // 11/31→12/31の1か月間
    }
    else if (period === "1year") {
        startDate.setMonth(0);
        startDate.setDate(1);
    }
    const result = {};
    orders.forEach((order) => {
        const dateObj = new Date(order.orderAt);
        // 期間外はスキップ
        if (period !== "1year" && (dateObj < startDate || dateObj > endDate))
            return;
        if (period === "1year" && (dateObj < startDate || dateObj > endDate))
            return;
        let key, label;
        if (period === "1year") {
            key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
            label = `${dateObj.getMonth() + 1}月`;
        }
        else {
            key = dateObj.toISOString().split("T")[0];
            label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
        }
        if (!result[key]) {
            result[key] = { label, sales: 0, orderCount: 0 };
        }
        result[key].sales += order.item.price;
        result[key].orderCount += 1;
    });
    return Object.keys(result)
        .sort()
        .map((key) => ({
        ...result[key],
        dateKey: key,
        period,
    }));
};
export async function runRevenueProcess(appId) {
    try {
        console.log(`📈 [REVENUE SERVICE] Processing revenue data for appId: ${appId}`);
        // APIから注文データを取得
        const apiUrl = `http://localhost:3000/api/debug/fetch-data/${appId}`;
        console.log(`📈 [REVENUE SERVICE] Fetching from: ${apiUrl}`);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`📈 [REVENUE SERVICE] API response success: ${data?.success}`);
        // APIレスポンスから注文データを抽出
        const orders = data?.success && data?.data?.userHistories
            ? data.data.userHistories.flatMap((user) => user.transactions.map((transaction) => ({
                orderAt: new Date(transaction.date).getTime(),
                item: { price: transaction.price },
            })))
            : [];
        console.log(`📈 [REVENUE SERVICE] Extracted ${orders.length} orders from ${data?.data?.userHistories?.length || 0} users`);
        // 各期間の売上データを計算
        const weekData = aggregateSales(orders, '1week');
        const monthData = aggregateSales(orders, '1month');
        const yearData = aggregateSales(orders, '1year');
        console.log(`📈 [REVENUE SERVICE] Aggregated data: Week(${weekData.length}), Month(${monthData.length}), Year(${yearData.length})`);
        // サマリー計算
        const weekTotal = weekData.reduce((sum, item) => sum + item.sales, 0);
        const monthTotal = monthData.reduce((sum, item) => sum + item.sales, 0);
        const yearTotal = yearData.reduce((sum, item) => sum + item.sales, 0);
        const summary = {
            weekTotal,
            monthTotal,
            yearTotal,
            avgWeekly: weekTotal / (weekData.length || 1),
            avgMonthly: monthTotal / (monthData.length || 1),
            avgYearly: yearTotal / (yearData.length || 1),
        };
        console.log(`📈 [REVENUE SERVICE] Summary calculated: Week=${weekTotal}, Month=${monthTotal}, Year=${yearTotal}`);
        return {
            weekData,
            monthData,
            yearData,
            summary,
        };
    }
    catch (error) {
        console.error('Error in runRevenueProcess:', error);
        throw error;
    }
}
