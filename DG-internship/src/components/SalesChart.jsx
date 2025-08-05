"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';

const data = [
  { month: '4月', sales: 23000 },
  { month: '5月', sales: 27000 },
  { month: '6月', sales: 42000 },
  { month: '7月', sales: 25500 },
  { month: '8月', sales: 31000 },
  { month: '9月', sales: 45000 },
];

const formatYAxis = (tickItem) => {
    return `${tickItem.toLocaleString()}円`
}

export const SalesChart = () => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, buttom: 10}}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="sales"
                    name="合計購入金額"
                    stroke='#28a745'
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}