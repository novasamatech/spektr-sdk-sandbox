import { useAutoAnimate } from '@formkit/auto-animate/react';
import type { ConnectionStatus } from '@novasamatech/host-api';
import { Star, XIcon } from 'lucide-react';
import { useUnit } from 'effector-react';
import { memo } from 'react';
import { cn } from '@/lib/utils';
import { $selectedTab, $tabs, closeTab, selectTab } from '@/state/tabs';
import { Button } from '@/components/ui/button';
import type { DAppTab } from '@/state/types';
import { $favorites, addFavorite, removeFavorite } from '@/state/favorites';

export const Tabs = memo(() => {
  const [parent] = useAutoAnimate(/* optional config */);

  const tabs = useUnit($tabs);
  const selectedTab = useUnit($selectedTab);
  const favorites = useUnit($favorites);

  return (
    <div
      ref={parent}
      className="flex h-13 w-full min-w-0 gap-2 overflow-y-auto p-2"
      style={{
        scrollbarWidth: 'none',
      }}
    >
      {tabs.map(tab => {
        return (
          <Tab
            key={tab.id}
            favorite={favorites.find(f => f.url === tab.dapp.url) !== undefined}
            selected={selectedTab === tab.id}
            tab={tab}
            onSelect={selectTab}
            onClose={closeTab}
            onFavoriteToggle={tab => {
              if (favorites.some(f => f.url === tab.dapp.url)) {
                removeFavorite(tab.dapp.url);
              } else {
                addFavorite(tab.dapp);
              }
            }}
          />
        );
      })}
    </div>
  );
});

type TabProps = {
  favorite: boolean;
  selected: boolean;
  tab: DAppTab;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onFavoriteToggle: (tab: DAppTab) => void;
};

const Tab = memo(({ favorite, selected, tab, onSelect, onClose, onFavoriteToggle }: TabProps) => {
  return (
    <div className="group relative h-fit w-fit">
      <Button
        className="ps-8 group-hover:pe-8"
        variant={selected ? 'outline' : 'ghost'}
        size="sm"
        onClick={() => onSelect(tab.id)}
      >
        {tab.dapp.name}
      </Button>
      <div className="absolute top-0 bottom-0 left-3.5 m-auto h-fit w-fit">
        <StatusIndicator status={tab.status} />
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn(
          'absolute top-0 bottom-0 left-1 z-10 m-auto size-6 opacity-0',
          'group-hover:bg-accent! group-hover:opacity-100 focus-visible:bg-accent! focus-visible:opacity-100',
        )}
        onClick={() => onFavoriteToggle(tab)}
      >
        <Star fill={favorite ? 'yellow' : 'none'} />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn(
          'absolute top-0 right-1 bottom-0 z-10 m-auto size-6 opacity-0',
          'group-hover:bg-accent! group-hover:opacity-100 focus-visible:bg-accent! focus-visible:opacity-100',
        )}
        onClick={() => onClose(tab.id)}
      >
        <XIcon />
      </Button>
    </div>
  );
});

const StatusIndicator = memo(({ status }: { status: ConnectionStatus }) => {
  return (
    <div
      className={cn('size-1.5 rounded-full', {
        'bg-red-600': status === 'disconnected',
        'bg-yellow-500': status === 'connecting',
        'bg-green-600': status === 'connected',
      })}
    ></div>
  );
});
