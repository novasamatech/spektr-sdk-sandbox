import '@novasamatech/host-papp-ui/styles.css';
import { createLazyClient } from '@novasamatech/statement-store';
import { getWsProvider } from 'polkadot-api/ws-provider';
import { useUnit } from 'effector-react';
import { useMemo } from 'react';
import { $ssSource } from './state/ss-source';

import { AppSidebar } from './views/app-sidebar';
import { Browser } from './views/browser';
import { Tabs } from './views/tabs';
import { PappProvider, PairingModal } from '@novasamatech/host-papp-ui';
import { createPappAdapter, SS_STABLE_STAGE_ENDPOINTS, SS_UNSTABLE_STAGE_ENDPOINTS } from '@novasamatech/host-papp';

export function App() {
  const ssSource = useUnit($ssSource);

  console.log(ssSource);

  const papp = useMemo(
    () =>
      createPappAdapter({
        appId: 'SDK Sandbox',
        metadata: 'https://spektr-sdk-sandbox-dev.novaspektr.io/papp-metadata.json',
        adapters: {
          lazyClient: createLazyClient(
            getWsProvider(ssSource === 'stable' ? SS_STABLE_STAGE_ENDPOINTS : SS_UNSTABLE_STAGE_ENDPOINTS),
          ),
        },
      }),
    [ssSource],
  );

  return (
    <PappProvider adapter={papp}>
      <div className="flex h-full overflow-hidden">
        <AppSidebar />
        <div className="flex w-full shrink flex-col overflow-hidden">
          <Tabs />
          <Browser />
        </div>
      </div>
      <PairingModal />
    </PappProvider>
  );
}
