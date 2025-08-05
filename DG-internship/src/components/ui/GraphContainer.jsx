import { LTVGraph } from './graphs/LTVGraph';
import { RevenueGraph } from './graphs/RevenueGraph';
import { DemographicsGraph } from './graphs/DemographicsGraph';
import { Paper, Box, Typography } from '@mui/material';
import { BarChart } from '@mui/icons-material';

export const GraphContainer = ({ activeTab, selectedAppId, selectedPeriod }) => {
  // アプリと期間が選択されていない場合のプレースホルダー
  if (!selectedAppId || !selectedPeriod) {
    return (
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          height: '500px',
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #e0e0e020',
        }}
      >
        <BarChart sx={{ fontSize: 80, mb: 3, color: 'primary.light', opacity: 0.5 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          データ分析ダッシュボード
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          アプリケーションと期間を選択すると<br />
          グラフが表示されます
        </Typography>
      </Paper>
    );
  }

  // 選択されたタブに応じてグラフコンポーネントを切り替え
  switch (activeTab) {
    case 'ltv':
      return (
        <LTVGraph 
          selectedAppId={selectedAppId}
          selectedPeriod={selectedPeriod}
        />
      );
    case 'revenue':
      return (
        <RevenueGraph 
          selectedAppId={selectedAppId}
          selectedPeriod={selectedPeriod}
        />
      );
    case 'demographics':
      return (
        <DemographicsGraph 
          selectedAppId={selectedAppId}
          selectedPeriod={selectedPeriod}
        />
      );
    default:
      return (
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            height: '500px',
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            不明な分析タイプです
          </Typography>
        </Paper>
      );
  }
};