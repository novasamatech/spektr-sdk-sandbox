import type { UserSession } from '@novasamatech/host-papp';
import { SigningErr } from '@novasamatech/host-api';
import { toHex } from '@polkadot-api/utils';
import { type SignerPayloadJSON, type SignerResult } from '@polkadot/types/types';
import { memo, useState } from 'react';
import { Button } from '../components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldLabel } from '../components/ui/field';

type Props = {
  session: UserSession;
  payload: SignerPayloadJSON;
  onCancel: (error: unknown) => void;
  onResult: (signResult: SignerResult) => void;
};

export const SignPayloadModal = memo(({ session, payload, onCancel, onResult }: Props) => {
  const [pending, setPending] = useState(false);

  const sign = () => {
    setPending(true);
    session
      .signPayload({
        ...payload,
        method: payload.method as `0x${string}`,
        assetId: payload.assetId,
        mode: payload.mode,
        withSignedTransaction: payload.withSignedTransaction,
        metadataHash: payload.metadataHash,
      })
      .andTee(() => setPending(false))
      .orTee(() => setPending(false))
      .match(
        ({ signature, signedTransaction }) =>
          onResult({
            id: 0,
            signature: toHex(signature) as `0x${string}`,
            signedTransaction,
          }),
        e => {
          onCancel(new SigningErr.Unknown({ reason: e.message }));
        },
      );
  };

  return (
    <Dialog modal open onOpenChange={open => !open && onCancel(new SigningErr.Rejected())}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sign transaction</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 overflow-hidden">
          <Field>
            <FieldLabel>Signer</FieldLabel>
            <FieldDescription className="truncate">{payload.address}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Chain</FieldLabel>
            <FieldDescription className="truncate">{payload.genesisHash}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Call data</FieldLabel>
            <FieldDescription className="break-all">{payload.method}</FieldDescription>
          </Field>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={sign} disabled={pending}>
            {pending ? 'Signing...' : 'Sign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
