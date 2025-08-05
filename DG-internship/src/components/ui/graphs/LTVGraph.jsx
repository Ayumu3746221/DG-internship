import { Paper, Box, Typography, Chip } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const chartData = [
  { day: '1日', light: 1200, middle: 4800, heavy: 12000 },
  { day: '7日', light: 1550, middle: 6200, heavy: 15500 },
  { day: '14日', light: 1700, middle: 7800, heavy: 18000 },
  { day: '30日', light: 1850, middle: 9200, heavy: 22500 },
  { day: '60日', light: 1950, middle: 10500, heavy: 26000 },
  { day: '90日', light: 2100, middle: 11800, heavy: 29500 },
];

// 2. Y軸の数値を「¥12K」のような形式にフォーマットする関数
const formatYAxis = (tickItem) => `¥${tickItem / 1000}K`;

// 3. グラフにマウスオーバーした際のカスタムツールチップ
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={4} sx={{ p: 2, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(5px)' }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>{`${label}時点`}</Typography>
        {payload.map((p) => (
          <Typography key={p.name} variant="body2" sx={{ color: p.color }}>
            {`${p.name}: ${p.value.toLocaleString()}円`}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

export const LTVGraph = ({ selectedAppId, selectedPeriod }) => {
  const color = '#667eea';

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 2, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
        backdropFilter: 'blur(10px)',
        border: `2px solid ${color}20`,
      }}
    >
      {/* --- ヘッダー部分は変更なし --- */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}
        >
          <TrendingUp fontSize="large" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: color }}>
            セグメント別平均LTV推移
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ライト課金者: ¥1,200 → ミドル課金者: ¥4,800 → ヘビー課金者: ¥12,000
          </Typography>
        </Box>
        {selectedAppId && selectedPeriod && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={selectedAppId} 
              size="small" 
              variant="outlined"
              sx={{ borderColor: color, color: color }}
            />
            <Chip 
              label={selectedPeriod === '1week' ? '1週間' : selectedPeriod === '1month' ? '1ヶ月' : '1年'} 
              size="small" 
              variant="outlined"
              sx={{ borderColor: color, color: color }}
            />
          </Box>
        )}
      </Box>

      {/* --- グラフエリアをRechartsに置き換え --- */}
      <Box sx={{ flex: 1, width: '100%', height: '100%' }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) => <span style={{ color: '#333' }}>{value}</span>} />
            <Line 
              type="monotone" 
              dataKey="light" 
              name="ライト"
              stroke="#667eea" 
              strokeWidth={3} 
              activeDot={{ r: 8 }} 
              animationDuration={1500} 
            />
            <Line 
              type="monotone" 
              dataKey="middle" 
              name="ミドル"
              stroke="#764ba2" 
              strokeWidth={3} 
              activeDot={{ r: 8 }} 
              animationDuration={1500}
              animationBegin={200}
            />
            <Line 
              type="monotone" 
              dataKey="heavy" 
              name="ヘビー"
              stroke="#8e9de8" 
              strokeWidth={3} 
              activeDot={{ r: 8 }} 
              animationDuration={1500}
              animationBegin={400} 
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* --- フッター情報も変更なし --- */}
      {selectedAppId && selectedPeriod && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderTopColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            最終更新: {new Date().toLocaleString('ja-JP')} | セグメント: 課金額によるユーザー分類
          </Typography>
        </Box>
      )}
    </Paper>
  );
};