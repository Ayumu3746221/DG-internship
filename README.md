# DG-internship

2025 年/デジタルガレージのインターシップ

# API

## 日次LTV API

```bash
GET /api/{appId}/ltv/chart-data
```

**パラメータ**:
- `appId`: アプリケーションID（必須）
- `startDate`: 開始日（オプション、形式: YYYY-MM-DD）
- `endDate`: 終了日（オプション、形式: YYYY-MM-DD）

**レスポンス**:

```json
{
    "success": true,
    "appId": "app_0001",
    "chartData": [
        {
            "date": "2024-01-01",
            "high": 2,
            "middle": 0,
            "low": 232
        },
        {
            "date": "2024-01-02",
            "high": 2,
            "middle": 1,
            "low": 231
        },
        {
            "date": "2024-01-03",
            "high": 3,
            "middle": 2,
            "low": 229
        }
    ]
}
```

## 月次LTV API

```bash
GET /api/{appId}/ltv/monthly-chart-data
```

**パラメータ**:
- `appId`: アプリケーションID（必須）
- `startDate`: 開始日（オプション、形式: YYYY-MM-DD）
- `endDate`: 終了日（オプション、形式: YYYY-MM-DD）

**機能**:
- 日次LTVデータを月別に集計し、月平均値を算出
- LTVセグメント（high/middle/low）ごとのユーザー数を月単位で表示

**レスポンス**:

```json
{
    "success": true,
    "appId": "app_0005",
    "chartData": [
        {
            "month": "2024-01",
            "high": 19,
            "middle": 11,
            "low": 202
        },
        {
            "month": "2024-02",
            "high": 47,
            "middle": 28,
            "low": 157
        },
        {
            "month": "2024-03",
            "high": 73,
            "middle": 38,
            "low": 121
        }
    ]
}
```

**使用例**:

```bash
# 全期間の月次データを取得
curl "http://localhost:3000/api/app_0005/ltv/monthly-chart-data"

# 特定期間の月次データを取得
curl "http://localhost:3000/api/app_0005/ltv/monthly-chart-data?startDate=2024-06-01&endDate=2024-09-30"
```
