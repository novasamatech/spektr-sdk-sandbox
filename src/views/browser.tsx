import { createContainer, createIframeProvider } from '@novasamatech/host-container';
import { useUnit } from 'effector-react';
import { Activity, memo, useEffect, useState } from 'react';
import { $selectedAccount, $wallets, getWalletsFx } from '@/state/accounts';
import { $selectedTab, $tabs, changeTabConnectionStatus } from '@/state/tabs';
import { type DAppTab } from '@/state/types';
import { useLooseRef } from '@/hooks/use-loose-ref';
import { NoDapp } from './no-dapp';

export const Browser = memo(() => {
  const tabs = useUnit($tabs);
  const selectedTab = useUnit($selectedTab);

  if (tabs.length === 0) {
    return (
      <div className="flex w-full items-center justify-center">
        <NoDapp />
      </div>
    );
  }

  return (
    <>
      {tabs.map(tab => (
        <Activity key={tab.id} mode={tab.id === selectedTab ? 'visible' : 'hidden'}>
          <Content tab={tab} />
        </Activity>
      ))}
    </>
  );
});

const Content = memo(({ tab }: { tab: DAppTab }) => {
  const selectedAccount = useUnit($selectedAccount);
  const wallets = useUnit($wallets);
  const accountRef = useLooseRef(selectedAccount);

  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    getWalletsFx();
  }, []);

  useEffect(() => {
    if (!iframe) return;

    const iframeProvider = createIframeProvider({
      iframe,
      url: tab.dapp.url,
    });
    const container = createContainer(iframeProvider);

    container.handleAccounts({
      async get() {
        const account = accountRef();
        if (account) {
          return [
            {
              address: account.address,
              genesisHash: null,
              name: account.name,
              type: 'sr25519',
            },
          ];
        }
        return [];
      },
      subscribe(callback) {
        return $selectedAccount.watch(account => {
          if (account) {
            callback([
              {
                address: account.address,
                genesisHash: null,
                name: account.name,
                type: 'sr25519',
              },
            ]);
          }
        });
      },
    });

    const getSigner = async (address: string) => {
      const account = accountRef();
      if (account && account.signer && address === account.address) {
        const wallet = wallets.find(w => w.extensionName === account.source);
        if (!wallet) {
          throw new Error(`Wallet ${account.source} not found.`);
        }
        await wallet.enable('SDK Sandbox');
        return wallet;
      }

      throw new Error("Can't sign raw data - account not found");
    };

    container.handleSignRequest({
      async signRaw(raw) {
        const wallet = await getSigner(raw.address);
        const { signature } = await wallet.signer.signRaw(raw);

        return {
          id: 0,
          signature,
        };
      },
      async signPayload(payload) {
        const wallet = await getSigner(payload.address);
        const { signature, signedTransaction } = await wallet.signer.signPayload(payload);

        return {
          id: 0,
          signature,
          signedTransaction,
        };
      },
      async createTransaction() {
        throw new Error('createTransaction not implemented.');
      },
    });

    container.subscribeConnectionStatus(status => {
      changeTabConnectionStatus({ id: tab.id, status });
    });

    container.isReady();

    return () => {
      container.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab.dapp, iframe]);
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-lg shadow-sm">
        <iframe ref={setIframe} className="h-full w-full grow appearance-none border-none transition-all" />
      </div>
    </div>
  );
});
