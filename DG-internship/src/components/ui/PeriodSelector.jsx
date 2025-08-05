import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const PERIOD_OPTIONS = [
  { value: '1week', label: '1週間' },
  { value: '1month', label: '1ヶ月' },
  { value: '1year', label: '1年' }
];

export const PeriodSelector = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>期間</InputLabel>
      <Select
        value={selectedPeriod || ''}
        onChange={(e) => onPeriodChange(e.target.value)}
        label="期間"
      >
        <MenuItem value="">
          <em>期間を選択してください</em>
        </MenuItem>
        {PERIOD_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};