import { useState } from "react";
import {
  BriefcaseBusiness,
  Building,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  Film,
  Globe,
  MapPin,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
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
import type { Campaign } from "@/types/marketplace";
import { campaignBudget, campaignLocation } from "@/data/marketplace";

const CREATOR_HUB_URL = (import.meta.env['VITE_CREATOR_HUB_URL'] as string | undefined) || "http://localhost:8080";

interface CampaignDetailDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignDetailDialog({
  campaign,
  open,
  onOpenChange,
}: CampaignDetailDialogProps) {
  if (!campaign) return null;

  const handleApply = () => {
    // Best-practice SaaS redirection: Send creator to their authenticated workspace application flow
    const applyUrl = `${CREATOR_HUB_URL}/campaigns/${campaign.id}/apply`;
    window.location.href = applyUrl;
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Opportunity link copied to clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand">
                <BriefcaseBusiness className="size-4" />
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-brand">
                {campaign.business} · {campaign.category}
              </p>
            </div>
            <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">
              Open for Applications
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold font-display mt-2">
            {campaign.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Posted by {campaign.business}. Review brief deliverables and submit your pitch via Creator Hub.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-3">
          {/* Objective / Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Campaign Objective
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              {campaign.description || "Looking for credible creators to produce high-impact regional content."}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg border border-border bg-secondary/50 p-4">
            <div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CircleDollarSign className="size-3.5 text-brand" /> Budget
              </span>
              <strong className="mt-1 block text-sm font-display">
                {campaignBudget(campaign)}
              </strong>
            </div>

            <div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5 text-brand" /> Location
              </span>
              <strong className="mt-1 block text-sm font-display">
                {campaignLocation(campaign)}
              </strong>
            </div>

            <div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock3 className="size-3.5 text-brand" /> Deadline
              </span>
              <strong className="mt-1 block text-sm font-display">
                {campaign.deadline || "Open"}
              </strong>
            </div>

            <div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="size-3.5 text-brand" /> Creators
              </span>
              <strong className="mt-1 block text-sm font-display">
                {campaign.creators || 1} needed
              </strong>
            </div>
          </div>

          {/* Deliverables Spec */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Film className="size-3.5 text-brand" /> Deliverables Specification
            </h4>
            <p className="mt-2 text-sm font-medium text-foreground">
              {campaign.deliverables || "Short-form video content and social media coverage."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded bg-secondary px-2.5 py-1">
                <CheckCircle2 className="size-3 text-success" /> Usage Rights: 6 Months Digital
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-secondary px-2.5 py-1">
                <CheckCircle2 className="size-3 text-success" /> Platform: {campaign.platform || "Instagram"}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-4">
          <Button variant="outline" size="sm" onClick={handleShare} className="w-full sm:w-auto">
            <Share2 className="size-4" /> Share Brief
          </Button>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button size="default" onClick={handleApply} className="w-full sm:w-auto">
              Apply via Creator Hub <ExternalLink className="size-4 ml-1" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
