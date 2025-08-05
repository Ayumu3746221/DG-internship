import { Paper, Box, Typography, Chip } from '@mui/material';
import { People } from '@mui/icons-material';

export const DemographicsGraph = ({ selectedAppId, selectedPeriod }) => {
  const color = '#6f42c1';

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
          <People fontSize="large" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: color }}>
            顧客属性分析
          </Typography>
          <Typography variant="body2" color="text.secondary">
            男性65% / 女性35% | 20-30代が最多課金セグメント
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
            {/* 性別比率の円グラフ */}
            <g transform="translate(120, 150)">
              {/* 男性部分 (65%) */}
              <path
                d="M 0,-60 A 60,60 0 1,1 37.08,46.35 L 0,0 Z"
                fill={color}
                opacity="0.8"
              />
              {/* 女性部分 (35%) */}
              <path
                d="M 37.08,46.35 A 60,60 0 0,1 0,-60 L 0,0 Z"
                fill="#dc3545"
                opacity="0.6"
              />
              {/* 中央のラベル */}
              <text x="0" y="-5" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
                性別比率
              </text>
              <text x="0" y="10" textAnchor="middle" fontSize="10" fill="#666">
                男性65%
              </text>
              <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
                女性35%
              </text>
            </g>
            
            {/* 年齢層の棒グラフ */}
            <g transform="translate(280, 50)">
              <text x="60" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">
                年齢層別課金額
              </text>
              
              {/* 年齢層バー */}
              {[
                { age: '10代', height: 30, value: '¥200K' },
                { age: '20代', height: 80, value: '¥650K' },
                { age: '30代', height: 100, value: '¥850K' },
                { age: '40代', height: 60, value: '¥400K' },
                { age: '50代+', height: 25, value: '¥150K' }
              ].map((item, index) => (
                <g key={item.age}>
                  <rect
                    x={index * 25}
                    y={150 - item.height}
                    width="20"
                    height={item.height}
                    fill={color}
                    opacity={0.6 + index * 0.1}
                    rx="2"
                  />
                  <text
                    x={index * 25 + 10}
                    y={170}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#666"
                  >
                    {item.age}
                  </text>
                  <text
                    x={index * 25 + 10}
                    y={150 - item.height - 5}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#666"
                  >
                    {item.value}
                  </text>
                </g>
              ))}
            </g>
            
            {/* 都道府県トップ3 */}
            <g transform="translate(50, 230)">
              <text x="0" y="0" fontSize="12" fontWeight="bold" fill="#333">
                課金額上位地域
              </text>
              <text x="0" y="20" fontSize="10" fill={color}>1位: 東京都 (28%)</text>
              <text x="120" y="20" fontSize="10" fill={color}>2位: 大阪府 (15%)</text>
              <text x="240" y="20" fontSize="10" fill={color}>3位: 愛知県 (12%)</text>
            </g>
            
            {/* 凡例 */}
            <g transform="translate(400, 60)">
              <circle cx="0" cy="0" r="6" fill={color} opacity="0.8"/>
              <text x="12" y="4" fontSize="10" fill={color}>男性</text>
              <circle cx="0" cy="20" r="6" fill="#dc3545" opacity="0.6"/>
              <text x="12" y="24" fontSize="10" fill="#dc3545">女性</text>
            </g>
          </svg>
        </Box>
      </Box>

      {/* フッター情報 */}
      {selectedAppId && selectedPeriod && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderTopColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            最終更新: {new Date().toLocaleString('ja-JP')} | 20-30代男性が主要課金層
          </Typography>
        </Box>
      )}
    </Paper>
  );
};