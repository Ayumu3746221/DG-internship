import { Paper, Box, Typography, Chip } from '@mui/material';
import { AttachMoney } from '@mui/icons-material';

export const RevenueGraph = ({ selectedAppId, selectedPeriod }) => {
  const color = '#28a745';

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 4, 
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
        backdropFilter: 'blur(10px)',
        border: `2px solid ${color}20`,
      }}
    >
      {/* ヘッダー */}
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
          <AttachMoney fontSize="large" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: color }}>
            曜日・時間別売上推移
          </Typography>
          <Typography variant="body2" color="text.secondary">
            平日平均: ¥850,000 → 土日平均: ¥1,105,000 (30%増)
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

      {/* グラフエリア */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: 2,
          border: `1px solid ${color}20`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="100%" height="300" viewBox="0 0 500 300">
            {/* グリッドライン */}
            {[50, 100, 150, 200, 250].map((y) => (
              <line key={y} x1="60" y1={y} x2="450" y2={y} stroke="#e0e0e0" strokeWidth="1" strokeDasharray="2,2"/>
            ))}
            
            {/* Y軸ラベル */}
            <text x="30" y="55" textAnchor="middle" fontSize="12" fill="#666">¥1.2M</text>
            <text x="30" y="105" textAnchor="middle" fontSize="12" fill="#666">¥900K</text>
            <text x="30" y="155" textAnchor="middle" fontSize="12" fill="#666">¥600K</text>
            <text x="30" y="205" textAnchor="middle" fontSize="12" fill="#666">¥300K</text>
            <text x="30" y="255" textAnchor="middle" fontSize="12" fill="#666">¥0</text>
            
            {/* 棒グラフ */}
            {[
              { day: '月', height: 80, x: 80 },
              { day: '火', height: 90, x: 130 },
              { day: '水', height: 85, x: 180 },
              { day: '木', height: 95, x: 230 },
              { day: '金', height: 100, x: 280 },
              { day: '土', height: 130, x: 330 },
              { day: '日', height: 120, x: 380 }
            ].map((item, index) => (
              <g key={item.day}>
                <rect
                  x={item.x - 15}
                  y={250 - item.height}
                  width="30"
                  height={item.height}
                  fill={index >= 5 ? color : '#6c757d'}
                  opacity="0.8"
                  rx="4"
                />
                <text
                  x={item.x}
                  y={270}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#666"
                >
                  {item.day}
                </text>
                {/* 値表示 */}
                <text
                  x={item.x}
                  y={250 - item.height - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#666"
                >
                  {index >= 5 ? '¥1.1M' : '¥850K'}
                </text>
              </g>
            ))}
            
            {/* 凡例 */}
            <rect x="400" y="40" width="12" height="12" fill="#6c757d" opacity="0.8" rx="2"/>
            <text x="418" y="50" fontSize="10" fill="#6c757d">平日</text>
            <rect x="400" y="60" width="12" height="12" fill={color} opacity="0.8" rx="2"/>
            <text x="418" y="70" fontSize="10" fill={color}>土日</text>
          </svg>
        </Box>
      </Box>

      {/* フッター情報 */}
      {selectedAppId && selectedPeriod && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderTopColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            最終更新: {new Date().toLocaleString('ja-JP')} | 土日の売上が平日より30%高い傾向
          </Typography>
        </Box>
      )}
    </Paper>
  );
};