import type { MockAPIResponse } from "../types/MockAPI.js";
import type { Transaction } from "../types/Transaction.js";

function convertUnixToDate(unixTimestamp: number): Date {
  return new Date(unixTimestamp);
}

// 3. メインの関数
/**
 * モックAPIからデータを取得し、ユーザーごとの購入履歴マップを作成する
 * @returns {Promise<Map<string, Transaction[]>>}
 */
export async function fetchAndPrepareData(
  appId: string
): Promise<Map<string, Transaction[]>> {
  const BASE_URL = "https://tjufwmnunr.ap-northeast-1.awsapprunner.com/api/v1";
  const MOCK_API_URL = `${BASE_URL}/orders`;
  const url = new URL(MOCK_API_URL);

  url.searchParams.append("appId", appId);
  url.searchParams.append("status", "completed");
  url.searchParams.append("sort", "desc");

  console.log("Fetching data from mock API..." + url.toString());

  try {
    const response: Response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const mockApiResponse: MockAPIResponse = await response.json();

    if (!mockApiResponse.meta.isSuccess) {
      throw new Error(
        mockApiResponse.meta.message || "Failed to fetch data from API."
      );
    }
    const userHistoryMap = new Map<string, Transaction[]>();

    for (const order of mockApiResponse.orders) {
      const userId = order.customer.id;

      const transaction: Transaction = {
        userId: userId,
        price: order.item.price,
        date: convertUnixToDate(order.orderAt),
      };

      if (userHistoryMap.has(userId)) {
        userHistoryMap.get(userId)?.push(transaction);
      } else {
        userHistoryMap.set(userId, [transaction]);
      }
    }

    console.log("Data preparation complete.");
    return userHistoryMap;
  } catch (error) {
    console.error("An error occurred in fetchAndPrepareData:", error);
    return new Map<string, Transaction[]>();
  }
}
