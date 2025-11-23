import { AppSidebar } from './views/app-sidebar';
import { Browser } from './views/browser';
import { Tabs } from './views/tabs';

export function App() {
  return (
    <div className="flex h-full overflow-hidden">
      <AppSidebar />
      <div className="flex w-full shrink flex-col overflow-hidden">
        <Tabs />
        <Browser />
      </div>
    </div>
  );
}
