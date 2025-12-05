import '@novasamatech/host-papp-ui/styles.css';

import { AppSidebar } from './views/app-sidebar';
import { Browser } from './views/browser';
import { Tabs } from './views/tabs';
import { PappProvider, PairingModal } from '@novasamatech/host-papp-ui';
import { createPappHostAdapter } from '@novasamatech/host-papp';

const papp = createPappHostAdapter(
  'SDK Sandbox',
  'https://gist.githubusercontent.com/valentunn/97938ca74b8d984f62ec95c7e633e24f/raw/b52f8ca43d8c3661d4360b16ca54652ad0a4f664/test_metadata.json',
);

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
