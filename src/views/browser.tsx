import { createContainer, createIframeProvider } from '@novasamatech/host-container';
import { useSession, useSessionIdentity } from '@novasamatech/host-papp-ui';
import { AccountId } from '@polkadot-api/substrate-bindings';
import { useUnit } from 'effector-react';
import { Activity, memo, useEffect, useState } from 'react';
import { $selectedTab, $tabs, changeTabConnectionStatus } from '@/state/tabs';
import { type DAppTab } from '@/state/types';
import { useLooseRef } from '@/hooks/use-loose-ref';
import { cn, nonNullable } from '@/lib/utils';
import { NoDapp } from './no-dapp';
import { type PromiseWithResolvers, promiseWithResolvers } from '@/lib/promiseWithResolvers';
import type { SignerPayloadJSON, SignerResult } from '@polkadot/types/types';
import { SignPayloadModal } from './sign-payload-modal';

const accountId = AccountId();

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
  const { session } = useSession();
  const [identity] = useSessionIdentity(session);
  const sessionRef = useLooseRef(session);
  const identityRef = useLooseRef(identity);
  const [signRequest, setSignRequest] = useState<SignerPayloadJSON | null>(null);
  const [signRequestPromise, setSignRequestPromise] = useState<PromiseWithResolvers<SignerResult> | null>(null);

  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!iframe) return;

    const iframeProvider = createIframeProvider({
      iframe,
      url: tab.dapp.url,
    });
    const container = createContainer(iframeProvider);

    container.handleAccounts({
      async get() {
        const account = sessionRef();
        const identity = identityRef();
        if (account) {
          return [
            {
              address: accountId.dec(account.remoteAccount.accountId),
              genesisHash: null,
              name: identity?.liteUsername,
              type: 'sr25519',
            },
          ];
        }
        return [];
      },
      subscribe() {
        return () => {};
      },
    });

    container.handleSignRequest({
      async signRaw() {
        throw new Error('signRaw is not implemented');
      },
      async signPayload(payload) {
        const resolver = promiseWithResolvers<SignerResult>();
        setSignRequest(payload);
        setSignRequestPromise(resolver);

        return resolver.promise;
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

  const hasOverlay = nonNullable(signRequest);

  return (
    <div className="h-full w-full overflow-hidden">
      <div
        className={cn('flex h-full w-full flex-col overflow-hidden rounded-lg shadow-sm', {
          'blur-[2px] grayscale-50': hasOverlay,
        })}
      >
        <iframe ref={setIframe} className="h-full w-full grow appearance-none border-none transition-all" />
      </div>

      {nonNullable(signRequest) && nonNullable(session) && (
        <SignPayloadModal
          session={session}
          payload={signRequest}
          onResult={result => {
            if (signRequestPromise) {
              signRequestPromise.resolve(result);
            }
            setSignRequestPromise(null);
            setSignRequest(null);
          }}
          onCancel={reason => {
            if (signRequestPromise) {
              signRequestPromise.reject(new Error(reason));
            }
            setSignRequestPromise(null);
            setSignRequest(null);
          }}
        />
      )}
    </div>
  );
});
