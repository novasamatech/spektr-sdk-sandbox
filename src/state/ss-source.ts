import { createEvent, restore } from 'effector';
import { persist } from 'effector-storage/local';

type SsSource = 'unstable' | 'stable';

export const setSsSource = createEvent<SsSource>();
export const $ssSource = restore(setSsSource, 'stable');

persist({
  key: 'ss-source',
  store: $ssSource,
  sync: true,
});
