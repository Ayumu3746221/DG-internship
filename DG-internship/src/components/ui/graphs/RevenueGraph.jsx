import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card"
import { SalesChart } from "../../SalesChart"
import { Paper, Box, Typography, Chip } from '@mui/material';

export const RevenueGraph = ({ selectedAppId, selectedPeriod }) => {
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
        <div className="bg-background text-foreground flex justify-center items-center p-8">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>売上ダッシュボード</CardTitle>
              <CardDescription>月別の合計購入金額の推移です。</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card>
        </div>
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