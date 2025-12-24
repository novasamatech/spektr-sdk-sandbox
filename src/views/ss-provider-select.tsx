import { useUnit } from 'effector-react';
import { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { $ssSource, setSsSource } from '@/state/ss-source';

export const SsProviderSelect = memo(() => {
  const ssSource = useUnit($ssSource);

  const labels = {
    stable: 'Stable',
    unstable: 'Unstable',
  } as const;

  return (
    <Select
      value={ssSource}
      onValueChange={source => {
        setSsSource(source as never);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select ss provider">Ss source: {labels[ssSource]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="stable">{labels.stable}</SelectItem>
        <SelectItem value="unstable">{labels.unstable}</SelectItem>
      </SelectContent>
    </Select>
  );
});
