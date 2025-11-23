import type { Wallet } from '@talismn/connect-wallets';
import { useUnit } from 'effector-react';
import { type PropsWithChildren, useEffect, useState } from 'react';
import {
  $accounts,
  $selectedAccount,
  $wallets,
  getProviderAccountsFx,
  getWalletsFx,
  selectAccount,
} from '@/state/accounts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

export const ConnectWallet = () => {
  const selectedAccount = useUnit($selectedAccount);

  return (
    <ConnectWalletModal>
      <Button className="w-full overflow-hidden" variant={selectedAccount ? 'default' : 'outline'}>
        {selectedAccount ? (selectedAccount.name ?? selectedAccount.address) : 'Connect Wallet'}
      </Button>
    </ConnectWalletModal>
  );
};

const ConnectWalletModal = ({ children }: PropsWithChildren) => {
  const wallets = useUnit($wallets);
  const accounts = useUnit($accounts);
  const selectedAccount = useUnit($selectedAccount);
  const [selected, setSelected] = useState<Wallet | null>(null);

  useEffect(() => {
    getWalletsFx();
  }, []);

  useEffect(() => {
    const selectedWallet = wallets.find(w => w.extensionName === selectedAccount?.source);
    if (selectedWallet) {
      setSelected(selectedWallet);
    }
  }, [wallets, selectedAccount]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select account</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {wallets.map(wallet => {
            if (selected === wallet) {
              const walletAccounts = accounts.filter(a => a.source === wallet.extensionName);
              return (
                <Field>
                  <FieldLabel>{wallet.title}</FieldLabel>
                  <Select
                    value={selectedAccount?.address}
                    onOpenChange={open => {
                      if (open) {
                        getProviderAccountsFx(wallet.extensionName);
                      }
                    }}
                    onValueChange={address => {
                      const account = walletAccounts.find(a => a.address === address);
                      if (account) {
                        selectAccount({ address: account.address, source: account.source });
                      }
                    }}
                  >
                    <SelectTrigger autoFocus className="w-full">
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {walletAccounts.map(account => (
                          <SelectItem key={account.address} value={account.address}>
                            {account.name ?? account.address}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              );
            }
            return (
              <Button
                key={wallet.extensionName}
                onClick={() => {
                  setSelected(wallet);
                  getProviderAccountsFx(wallet.extensionName);
                }}
              >
                {wallet.title}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
