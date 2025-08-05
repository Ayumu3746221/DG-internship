# DG-internship

2025 年/デジタルガレージのインターシップ

# API

```bash
/api/{appId}/ltv/chart-data
```

レスポンス

```json
{
    "success": true,
    "appId": "app_0001"
    "chartData" :[
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
        },
        ...
    ]
}
```
