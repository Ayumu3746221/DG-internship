// 顧客属性データを取得・分析するサービス
// DemographicsGraph コンポーネントのロジックを参考に実装
// 顧客属性データを分析する関数
const analyzeDemographics = (orders) => {
    if (!orders || !Array.isArray(orders)) {
        return {
            genderRatio: { male: 0, female: 0, malePercentage: 0, femalePercentage: 0 },
            ageGroups: {},
            prefectures: {},
            topPrefectures: [],
            totalRevenue: 0,
            totalUsers: 0,
            summary: {
                mainAgeGroup: "不明",
                mainGender: "不明",
                topRegion: "不明",
                avgRevenuePerUser: 0,
            },
        };
    }
    const demographics = {
        genderRatio: { male: 0, female: 0 },
        ageGroups: {
            "10代": { count: 0, revenue: 0 },
            "20代": { count: 0, revenue: 0 },
            "30代": { count: 0, revenue: 0 },
            "40代": { count: 0, revenue: 0 },
            "50代+": { count: 0, revenue: 0 },
        },
        prefectures: {},
        totalRevenue: 0,
    };
    orders.forEach((order) => {
        const { customer, item } = order;
        // 性別集計
        if (customer.gender === "male") {
            demographics.genderRatio.male++;
        }
        else if (customer.gender === "female") {
            demographics.genderRatio.female++;
        }
        // 年齢層計算
        const birthYear = new Date(customer.birthDate).getFullYear();
        const age = 2024 - birthYear;
        let ageGroup;
        if (age < 20)
            ageGroup = "10代";
        else if (age < 30)
            ageGroup = "20代";
        else if (age < 40)
            ageGroup = "30代";
        else if (age < 50)
            ageGroup = "40代";
        else
            ageGroup = "50代+";
        demographics.ageGroups[ageGroup].count++;
        demographics.ageGroups[ageGroup].revenue += item.price;
        // 都道府県集計
        const prefecture = customer.prefecture.name;
        if (!demographics.prefectures[prefecture]) {
            demographics.prefectures[prefecture] = { count: 0, revenue: 0 };
        }
        demographics.prefectures[prefecture].count++;
        demographics.prefectures[prefecture].revenue += item.price;
        demographics.totalRevenue += item.price;
    });
    // パーセンテージ計算
    const totalUsers = demographics.genderRatio.male + demographics.genderRatio.female;
    const malePercentage = totalUsers > 0 ? Math.round((demographics.genderRatio.male / totalUsers) * 100) : 0;
    const femalePercentage = totalUsers > 0 ? Math.round((demographics.genderRatio.female / totalUsers) * 100) : 0;
    // 年齢層パーセンテージ
    const ageGroupsWithPercentage = Object.entries(demographics.ageGroups).reduce((acc, [key, data]) => {
        acc[key] = {
            ...data,
            percentage: demographics.totalRevenue > 0 ? Math.round((data.revenue / demographics.totalRevenue) * 100) : 0,
        };
        return acc;
    }, {});
    // 都道府県パーセンテージと上位3位
    const prefecturesWithPercentage = Object.entries(demographics.prefectures).reduce((acc, [key, data]) => {
        acc[key] = {
            ...data,
            percentage: demographics.totalRevenue > 0 ? Math.round((data.revenue / demographics.totalRevenue) * 100) : 0,
        };
        return acc;
    }, {});
    const topPrefectures = Object.entries(prefecturesWithPercentage)
        .sort(([, a], [, b]) => b.revenue - a.revenue)
        .slice(0, 3)
        .map(([name, data]) => ({
        name,
        percentage: data.percentage,
        revenue: data.revenue,
    }));
    // サマリー情報
    const mainAgeGroup = Object.entries(ageGroupsWithPercentage).reduce((a, b) => a[1].revenue > b[1].revenue ? a : b)[0];
    const mainGender = malePercentage > femalePercentage ? "男性" : "女性";
    const topRegion = topPrefectures[0]?.name || "不明";
    const avgRevenuePerUser = totalUsers > 0 ? Math.round(demographics.totalRevenue / totalUsers) : 0;
    return {
        genderRatio: {
            male: demographics.genderRatio.male,
            female: demographics.genderRatio.female,
            malePercentage,
            femalePercentage,
        },
        ageGroups: ageGroupsWithPercentage,
        prefectures: prefecturesWithPercentage,
        topPrefectures,
        totalRevenue: demographics.totalRevenue,
        totalUsers,
        summary: {
            mainAgeGroup,
            mainGender,
            topRegion,
            avgRevenuePerUser,
        },
    };
};
export async function runDemographicsProcess(appId) {
    try {
        console.log(`👥 [DEMOGRAPHICS SERVICE] Processing demographics data for appId: ${appId}`);
        // APIから注文データを取得
        const apiUrl = `https://tjufwmnunr.ap-northeast-1.awsapprunner.com/api/v1/orders?appId=${appId}&status=completed&sort=desc`;
        console.log(`👥 [DEMOGRAPHICS SERVICE] Fetching from: ${apiUrl}`);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch demographics data: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`👥 [DEMOGRAPHICS SERVICE] API response success: ${data?.meta?.isSuccess}, orders: ${data?.orders?.length || 0}`);
        // データを分析
        const analysis = data?.meta?.isSuccess
            ? analyzeDemographics(data.orders)
            : analyzeDemographics([]);
        console.log(`👥 [DEMOGRAPHICS SERVICE] Analysis completed: ${analysis.totalUsers} users, ${analysis.summary.mainGender} majority, top region: ${analysis.summary.topRegion}`);
        return analysis;
    }
    catch (error) {
        console.error('Error in runDemographicsProcess:', error);
        throw error;
    }
}
