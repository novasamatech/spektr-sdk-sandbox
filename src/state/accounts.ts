import { type WalletAccount, getWallets } from '@talismn/connect-wallets';
import { combine, createEffect, createEvent, createStore, restore, sample } from 'effector';
import { persist } from 'effector-storage/local';
import { nonNullable } from '@/lib/utils';

export const getWalletsFx = createEffect(() => getWallets().filter(w => w.installed && w.title !== 'Nova Wallet'));
export const $wallets = restore(getWalletsFx.doneData, []).reset(getWalletsFx.fail);

export const getProviderAccountsFx = createEffect(async (source: string) => {
  const wallets = await getWallets();
  const wallet = wallets.find(w => w.extensionName === source);
  if (wallet) {
    if (!wallet.extension) {
      await wallet.enable('SDK Sandbox');
    }
    return wallet.getAccounts();
  } else {
    return [];
  }
});
export const $accounts = createStore<WalletAccount[]>([]);

export const selectAccount = createEvent<{ address: string; source: string } | null>();
export const $selectedAccountStored = restore(selectAccount, null);
export const $selectedAccount = combine($accounts, $selectedAccountStored, (accounts, selected) => {
  if (!selected) return null;
  return accounts.find(a => a.address === selected.address && a.source === selected.source) ?? null;
});

sample({
  clock: $selectedAccountStored,
  filter: nonNullable,
  fn: a => a?.source ?? 'unknown',
  target: getProviderAccountsFx,
});

sample({
  clock: getWalletsFx.doneData,
  target: $wallets,
});

sample({
  clock: getProviderAccountsFx.done,
  source: $accounts,
  fn(accounts, { params: source, result }) {
    const cleared = accounts.filter(a => a.source !== source);
    return cleared.concat(result);
  },
  target: $accounts,
});

persist({
  key: 'selectedAccountStored',
  store: $selectedAccountStored,
  sync: true,
});
