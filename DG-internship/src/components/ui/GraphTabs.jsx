import { FormControl, InputLabel, ToggleButtonGroup, ToggleButton, Box, Typography } from '@mui/material';
import { TrendingUp, AttachMoney, People } from '@mui/icons-material';

const GRAPH_TYPES = [
  { value: 'ltv', label: 'LTV推移', description: 'セグメント別平均LTV', icon: <TrendingUp /> },
  { value: 'revenue', label: '売上推移', description: '曜日・時間別売上', icon: <AttachMoney /> },
  { value: 'demographics', label: '顧客属性', description: '性別・年齢・地域', icon: <People /> }
];

export const GraphTabs = ({ activeTab, onTabChange }) => {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
        データ分析
      </Typography>
      <ToggleButtonGroup
        value={activeTab}
        exclusive
        onChange={(e, newValue) => newValue && onTabChange(newValue)}
        aria-label="データ分析タイプ"
        fullWidth
        sx={{
          '& .MuiToggleButton-root': {
            border: '1px solid',
            borderColor: 'divider',
            '&.Mui-selected': {
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a72e3 30%, #6d4498 90%)',
              },
            },
          },
        }}
      >
        {GRAPH_TYPES.map((tab) => (
          <ToggleButton
            key={tab.value}
            value={tab.value}
            aria-label={tab.description}
            title={tab.description}
            sx={{ 
              flexDirection: 'column',
              gap: 0.5,
              py: 1.5,
              fontSize: '0.75rem',
            }}
          >
            {tab.icon}
            {tab.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};