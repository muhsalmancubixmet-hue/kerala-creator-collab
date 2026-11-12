import { useState } from "react";
import { Send, Loader2, Sparkles, Building, Mail, Phone, User, DollarSign } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { submitCollaborationInquiry, type CollaborationInquiryPayload } from "@/services/marketplace-api";
import type { Creator } from "@/types/marketplace";

interface CollaborationDialogProps {
  creator: Creator;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: string | undefined;
  defaultPrice?: number | null | undefined;
}

export function CollaborationDialog({
  creator,
  open,
  onOpenChange,
  defaultService,
  defaultPrice,
}: CollaborationDialogProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [subject, setSubject] = useState(
    defaultService ? `${defaultService} Collaboration Brief` : "Influencer Campaign Proposal",
  );
  const [budget, setBudget] = useState(defaultPrice ? String(defaultPrice) : "25000");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientEmail.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, subject, and proposal brief.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: CollaborationInquiryPayload = {
        creator_handle: creator.handle.replace(/^@/, ""),
        client_name: clientName.trim(),
        client_email: clientEmail.trim(),
        subject: subject.trim(),
        message: message.trim(),
        currency: creator.currency || "INR",
      };
      if (clientPhone.trim()) {
        payload.client_phone = clientPhone.trim();
      }
      if (companyName.trim()) {
        payload.company_name = companyName.trim();
      } else {
        payload.company_name = clientName.trim();
      }
      if (budget && !isNaN(parseInt(budget, 10))) {
        payload.budget = parseInt(budget, 10);
      }
      if (defaultService) {
        const matchedService = creator.services?.find(
          (s) => s.name.toLowerCase() === defaultService.toLowerCase() || s.id === defaultService,
        );
        payload.service_id = matchedService?.id || defaultService;
      }

      const res = await submitCollaborationInquiry(payload);

      toast.success(
        res?.detail ||
          `Collaboration proposal sent to ${creator.name}! They will review it in Creator Hub.`,
      );
      onOpenChange(false);
      // Reset optional fields
      setMessage("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit collaboration request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand">
              <Sparkles className="size-4" />
            </span>
            <DialogTitle className="text-xl font-bold font-display">
              Request Collaboration with {creator.name}
            </DialogTitle>
          </div>
          <DialogDescription>
            Submit your campaign brief or inquiry directly. The creator will receive your proposal
            in their Creator Hub dashboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <User className="size-3.5" /> Your Name *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Rahul Menon"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Building className="size-3.5" /> Company / Brand Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Kalyan Silks / Cafe Malabar"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Mail className="size-3.5" /> Work Email *
              </label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Phone className="size-3.5" /> Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+91 98470 00000"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">
                Subject / Campaign Title *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Festival Brand Reel Campaign"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                <DollarSign className="size-3.5" /> Budget ({creator.currency || "INR"})
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="25000"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">
              Campaign Brief & Deliverables *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Outline what deliverables you are looking for (e.g. 1 Instagram Reel, story coverage, timeline, key brand message)..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" /> Send Proposal
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
