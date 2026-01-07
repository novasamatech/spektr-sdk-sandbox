import { useAuthentication, useSession, useSessionIdentity } from '@novasamatech/host-papp-react-ui';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

export const ConnectWallet = () => {
  const auth = useAuthentication();
  const { session } = useSession();

  const [identity] = useSessionIdentity(session);

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full overflow-hidden" variant="default">
            {identity ? identity.liteUsername : 'Unknown user'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem onClick={() => auth.disconnect(session)}>Disconnect</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button className="w-full overflow-hidden" variant="outline" onClick={() => auth.authenticate()}>
      Connect Polkadot
    </Button>
  );
};
