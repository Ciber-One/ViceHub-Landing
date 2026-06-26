import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Logo } from "@/components/Logo";
import { useWaitlist } from "@/context/WaitlistContext";

export const WaitlistDialog = () => {
  const { open, setOpen } = useWaitlist();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent data-testid="waitlist-dialog" className="bg-vice-card border-white/10 text-tprimary max-w-md">
        <DialogHeader>
          <div className="mb-2"><Logo className="h-14" /></div>
          <DialogTitle className="font-heading text-2xl font-medium">Join the Waitlist</DialogTitle>
          <DialogDescription className="text-tsec leading-relaxed pt-1">
            Be among the first to experience ViceHub when GTA 6 launches on November 19, 2026.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-2">
          <WaitlistForm source="dialog" testid="dialog-waitlist" />
          <p className="mt-4 text-xs text-tsec/50">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
