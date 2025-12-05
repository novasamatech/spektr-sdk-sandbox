import '@novasamatech/host-papp-ui/styles.css';

import { AppSidebar } from './views/app-sidebar';
import { Browser } from './views/browser';
import { Tabs } from './views/tabs';
import { PappProvider, PairingModal } from '@novasamatech/host-papp-ui';
import { createPappHostAdapter } from '@novasamatech/host-papp';

const papp = createPappHostAdapter('SDK Sandbox', 'https://shorturl.at/zGkir');

export function App() {
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
