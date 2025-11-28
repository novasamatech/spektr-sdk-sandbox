import type { ConnectionStatus } from '@novasamatech/host-api';

export type DApp = {
  name: string;
  url: string;
};

export type DAppTab = {
  id: string;
  dapp: DApp;
  location: string;
  status: ConnectionStatus;
};
