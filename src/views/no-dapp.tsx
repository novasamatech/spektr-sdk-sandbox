import { useUnit } from 'effector-react';
import { Box, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { $favorites } from '@/state/favorites';
import { openTab } from '@/state/tabs';
import { AddDappModal } from './add-dapp-modal';

export const NoDapp = () => {
  const favorites = useUnit($favorites);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Box />
        </EmptyMedia>
        <EmptyTitle>Hello!</EmptyTitle>
        <EmptyDescription>Your Dapp will display here</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {favorites.map(dapp => (
          <Button key={dapp.url} variant="ghost" size="sm" onClick={() => openTab(dapp)}>
            <Star /> {dapp.name}
          </Button>
        ))}
        {favorites.length > 0 && <EmptyDescription>or</EmptyDescription>}
        <AddDappModal>
          <Button variant="ghost">
            <Plus /> Add new Dapp
          </Button>
        </AddDappModal>
      </EmptyContent>
    </Empty>
  );
};
