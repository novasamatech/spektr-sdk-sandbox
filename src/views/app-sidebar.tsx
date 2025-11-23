import { useUnit } from 'effector-react';
import { Plus, Star, User, XIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { $favorites, removeFavorite } from '@/state/favorites';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { openTab } from '../state/tabs';
import { AddDappModal } from './add-dapp-modal';
import { ConnectWallet } from './connect-wallet';

export const AppSidebar = () => {
  const favorites = useUnit($favorites);

  return (
    <SidebarProvider className="w-fit">
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="gap-2">
              <User />
              <span>Account</span>
            </SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <ConnectWallet />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="gap-2">
              <Star />
              <span>favorites</span>
            </SidebarGroupLabel>
            <SidebarMenu>
              {favorites.map(item => {
                return (
                  <div key={item.url} className="group/favorites relative h-fit w-full">
                    <SidebarMenuButton
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      onClick={() => {
                        openTab(item);
                      }}
                    >
                      {item.name}
                    </SidebarMenuButton>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className={cn(
                        'absolute top-0 right-1 bottom-0 z-10 m-auto size-6 opacity-0',
                        'group-hover/favorites:bg-accent! group-hover/favorites:opacity-100 focus-visible:bg-accent! focus-visible:opacity-100',
                      )}
                      onClick={() => removeFavorite(item.url)}
                    >
                      <XIcon />
                    </Button>
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <AddDappModal>
              <SidebarMenuButton>
                <Plus />
                <span>Add Dapp</span>
              </SidebarMenuButton>
            </AddDappModal>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};
