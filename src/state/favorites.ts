import { createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';
import type { DApp } from './types';

export const addFavorite = createEvent<DApp>();
export const removeFavorite = createEvent<string>();
export const $favorites = createStore<DApp[]>([]);

persist({
  key: 'favorites',
  store: $favorites,
  sync: true,
});

sample({
  clock: addFavorite,
  source: $favorites,
  fn(list, item) {
    const existing = list.find(i => i.url === item.url);
    if (existing) {
      return list;
    }

    return list.concat(item);
  },
  target: $favorites,
});

sample({
  clock: removeFavorite,
  source: $favorites,
  fn(list, url) {
    return list.filter(i => i.url !== url);
  },
  target: $favorites,
});
