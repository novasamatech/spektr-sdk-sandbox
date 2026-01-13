import { createContainer, createIframeProvider } from '@novasamatech/host-container';
import { toHex } from '@novasamatech/host-api';
import { useSession, useSessionIdentity } from '@novasamatech/host-papp-react-ui';
import { useUnit } from 'effector-react';
import { fromPromise } from 'neverthrow';
import { Activity, memo, useEffect, useState } from 'react';
import { $selectedTab, $tabs, changeTabConnectionStatus } from '@/state/tabs';
import { type DAppTab } from '@/state/types';
import { useLooseRef } from '@/hooks/use-loose-ref';
import { cn, nonNullable } from '@/lib/utils';
import { NoDapp } from './no-dapp';
import { type PromiseWithResolvers, promiseWithResolvers } from '@/lib/promiseWithResolvers';
import type { SignerPayloadJSON, SignerResult } from '@polkadot/types/types';
import { SignPayloadModal } from './sign-payload-modal';

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

    container.handleFeature((params, { ok }) => {
      if (params.tag === 'Chain') {
        return ok(false);
      }
      return ok(false);
    });

    container.handleGetNonProductAccounts((_, { ok }) => {
      const account = sessionRef();
      const identity = identityRef();
      if (account) {
        return ok([{ publicKey: account.remoteAccount.accountId, name: identity?.liteUsername }]);
      }
      return ok([]);
    });

    container.handleSignPayload((payload, { ok, err }) => {
      const resolver = promiseWithResolvers<SignerResult>();
      setSignRequest(payload);
      setSignRequestPromise(resolver);

      return fromPromise(resolver.promise, e => e as never)
        .andThen(result => {
          console.log({
            signature: result.signature,
            signedTransaction: result.signedTransaction
              ? typeof result.signedTransaction === 'string'
                ? result.signedTransaction
                : toHex(result.signedTransaction)
              : undefined,
          });

          return ok({
            signature: result.signature,
            signedTransaction: result.signedTransaction
              ? typeof result.signedTransaction === 'string'
                ? result.signedTransaction
                : toHex(result.signedTransaction)
              : undefined,
          });
        })
        .orElse(e => err(e));
    });

    container.subscribeConnectionStatus(status => {
      changeTabConnectionStatus({ id: tab.id, status });
    });

    const ready = container.isReady();
    ready.then(ready => {
      if (ready) {
        console.log('Container ready');
      }
    });

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
              signRequestPromise.reject(reason);
            }
            setSignRequestPromise(null);
            setSignRequest(null);
          }}
        />
      )}
    </div>
  );
});
