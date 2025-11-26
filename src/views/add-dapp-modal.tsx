import { memo, type PropsWithChildren, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { openTab } from '@/state/tabs';
import { addFavorite } from '@/state/favorites';

export const AddDappModal = memo(({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          className="grid gap-4"
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());

            const dapp = {
              name: data.name.toString(),
              url: data.url.toString(),
            };

            addFavorite(dapp);
            openTab(dapp);
            setOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Add DApp</DialogTitle>
            <DialogDescription>Bibip</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your dapp name" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="url">Url</Label>
              <Input type="url" name="url" id="url" placeholder="https://example.com" pattern="http.+" required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
