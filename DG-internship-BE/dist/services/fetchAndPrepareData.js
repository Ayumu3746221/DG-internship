import dotenv from "dotenv";
dotenv.config();
function convertUnixToDate(unixTimestamp) {
    return new Date(unixTimestamp);
}
// 3. メインの関数
/**
 * モックAPIからデータを取得し、ユーザーごとの購入履歴マップを作成する
 * @returns {Promise<Map<string, Transaction[]>>}
 */
export async function fetchAndPrepareData(appId) {
    const BASE_URL = process.env.BASE_URL;
    const MOCK_API_URL = `${BASE_URL}/orders`;
    const url = new URL(MOCK_API_URL);
    url.searchParams.append("appId", appId);
    url.searchParams.append("status", "completed");
    url.searchParams.append("sort", "desc");
    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const mockApiResponse = await response.json();
        if (!mockApiResponse.meta.isSuccess) {
            throw new Error(mockApiResponse.meta.message || "Failed to fetch data from API.");
        }
        const userHistoryMap = new Map();
        for (const order of mockApiResponse.orders) {
            const userId = order.customer.id;
            const transaction = {
                userId: userId,
                price: order.item.price,
                date: convertUnixToDate(order.orderAt),
            };
            if (userHistoryMap.has(userId)) {
                userHistoryMap.get(userId)?.push(transaction);
            }
            else {
                userHistoryMap.set(userId, [transaction]);
            }
        }
        return userHistoryMap;
    }
    catch (error) {
        console.error("An error occurred in fetchAndPrepareData:", error);
        return new Map();
    }
}
