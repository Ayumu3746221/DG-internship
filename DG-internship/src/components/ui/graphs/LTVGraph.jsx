import { Paper, Box, Typography, Chip } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

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
            <defs>
              <linearGradient id="ltvGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#667eea" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#764ba2" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#667eea" stopOpacity="0.4"/>
              </linearGradient>
            </defs>
            
            {/* グリッドライン */}
            {[50, 100, 150, 200, 250].map((y) => (
              <line key={y} x1="60" y1={y} x2="450" y2={y} stroke="#e0e0e0" strokeWidth="1" strokeDasharray="2,2"/>
            ))}
            
            {/* Y軸ラベル */}
            <text x="30" y="55" textAnchor="middle" fontSize="12" fill="#666">¥12K</text>
            <text x="30" y="105" textAnchor="middle" fontSize="12" fill="#666">¥8K</text>
            <text x="30" y="155" textAnchor="middle" fontSize="12" fill="#666">¥4K</text>
            <text x="30" y="205" textAnchor="middle" fontSize="12" fill="#666">¥2K</text>
            <text x="30" y="255" textAnchor="middle" fontSize="12" fill="#666">¥0</text>
            
            {/* X軸ラベル */}
            {['1日', '7日', '14日', '30日', '60日', '90日'].map((label, index) => (
              <text key={label} x={80 + index * 60} y="280" textAnchor="middle" fontSize="12" fill="#666">
                {label}
              </text>
            ))}
            
            {/* ライト課金者のライン */}
            <polyline
              fill="none"
              stroke="#667eea"
              strokeWidth="3"
              points="80,220 140,210 200,205 260,200 320,195 380,190"
            />
            
            {/* ミドル課金者のライン */}
            <polyline
              fill="none"
              stroke="#764ba2"
              strokeWidth="3"
              points="80,180 140,165 200,155 260,145 320,140 380,135"
            />
            
            {/* ヘビー課金者のライン */}
            <polyline
              fill="none"
              stroke="#8e9de8"
              strokeWidth="3"
              points="80,120 140,105 200,95 260,85 320,75 380,65"
            />
            
            {/* データポイント */}
            <circle cx="380" cy="190" r="5" fill="#667eea"/>
            <circle cx="380" cy="135" r="5" fill="#764ba2"/>
            <circle cx="380" cy="65" r="5" fill="#8e9de8"/>
            
            {/* 凡例 */}
            <circle cx="400" cy="190" r="4" fill="#667eea"/>
            <text x="410" y="195" fontSize="10" fill="#667eea">ライト</text>
            <circle cx="400" cy="135" r="4" fill="#764ba2"/>
            <text x="410" y="140" fontSize="10" fill="#764ba2">ミドル</text>
            <circle cx="400" cy="65" r="4" fill="#8e9de8"/>
            <text x="410" y="70" fontSize="10" fill="#8e9de8">ヘビー</text>
          </svg>
        </Box>
      </Box>

      {/* フッター情報 */}
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