import { FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Box } from '@mui/material';
import { useApps } from '../../hooks/useApps';

export const AppSelector = ({ selectedAppId, onAppChange }) => {
  const { apps, loading, error } = useApps();

  if (loading) {
    return (
      <FormControl fullWidth>
        <InputLabel>アプリケーション</InputLabel>
        <Select
          value=""
          label="アプリケーション"
          disabled
          endAdornment={
            <Box sx={{ mr: 2 }}>
              <CircularProgress size={20} />
            </Box>
          }
        >
          <MenuItem value="">Loading apps...</MenuItem>
        </Select>
      </FormControl>
    );
  }

  if (error) {
    return (
      <FormControl fullWidth error>
        <Alert severity="error" sx={{ mb: 1 }}>
          アプリの読み込みに失敗しました
        </Alert>
        <InputLabel>アプリケーション</InputLabel>
        <Select
          value=""
          label="アプリケーション"
          disabled
        >
          <MenuItem value="">Error loading apps</MenuItem>
        </Select>
      </FormControl>
    );
  }

  const safeApps = Array.isArray(apps) ? apps : [];

  return (
    <FormControl fullWidth>
      <InputLabel>アプリケーション</InputLabel>
      <Select
        value={selectedAppId || ''}
        onChange={(e) => onAppChange(e.target.value)}
        label="アプリケーション"
      >
        <MenuItem value="">
          <em>アプリを選択してください</em>
        </MenuItem>
        {safeApps.map((app) => (
          <MenuItem key={app?.id || Math.random()} value={app?.id || ''}>
            {app?.name || 'Unknown App'}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};