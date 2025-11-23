import type { ConnectionStatus } from '@novasamatech/spektr-sdk-transport';
import { createStore, createEvent, sample, restore } from 'effector';
import { persist } from 'effector-storage/local';
import { nanoid } from 'nanoid';
import { spread } from 'patronum';
import type { DApp, DAppTab } from './types';

export const selectTab = createEvent<string>();
export const openTab = createEvent<DApp>();
export const closeTab = createEvent<string>();
export const changeTabConnectionStatus = createEvent<{ id: string; status: ConnectionStatus }>();
export const $selectedTab = restore(selectTab, null);
export const $tabs = createStore<DAppTab[]>([]);

persist({
  key: 'tabs',
  store: $tabs,
  sync: true,
});

persist({
  key: 'selectedTab',
  store: $selectedTab,
  sync: true,
});

sample({
  clock: openTab,
  source: $tabs,
  fn(tabs, dapp) {
    const id = nanoid();
    const location = new URL(dapp.url).pathname;

    return {
      tabs: tabs.concat({
        id,
        dapp,
        location,
        status: 'disconnected',
      }),
      select: id,
    };
  },
  target: spread({
    tabs: $tabs,
    select: selectTab,
  }),
});

sample({
  clock: closeTab,
  source: $tabs,
  fn(tabs, id) {
    return tabs.filter(tab => tab.id !== id);
  },
  target: $tabs,
});

sample({
  clock: changeTabConnectionStatus,
  source: $tabs,
  fn(tabs, { id, status }) {
    const tab = tabs.find(t => t.id === id);

    if (tab) {
      return tabs.map(t =>
        t.id === tab.id
          ? {
              ...tab,
              status,
            }
          : t,
      );
    }

    return tabs;
  },
  target: $tabs,
});

sample({
  clock: $tabs,
  source: $selectedTab,
  fn(selected, tabs) {
    const hasSelected = tabs.some(tab => tab.id === selected);

    if (hasSelected) {
      return selected;
    } else {
      return tabs.at(-1)?.id ?? null;
    }
  },
  target: $selectedTab,
});
