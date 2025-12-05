import { useSignInFlow } from '@novasamatech/host-papp-ui';
import { Button } from '@/components/ui/button';

export const ConnectWallet = () => {
  const signIn = useSignInFlow();

  return (
    <Button
      className="w-full overflow-hidden"
      variant={signIn.identity ? 'default' : 'outline'}
      onClick={() => signIn.signIn()}
    >
      {signIn.identity ? signIn.identity.liteUsername : 'Connect Polkadot'}
    </Button>
  );
};
