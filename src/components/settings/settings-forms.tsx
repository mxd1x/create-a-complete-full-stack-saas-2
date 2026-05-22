"use client";

import { useTransition } from "react";
import {
  updateNotificationAction,
  updateOrganizationAction,
  updateProfileAction
} from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({
  name,
  title,
  email
}: {
  name: string | null;
  title: string | null;
  email: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => startTransition(() => updateProfileAction(fd))}
      className="grid max-w-md gap-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" defaultValue={name ?? ""} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Job title</Label>
        <Input id="title" name="title" defaultValue={title ?? ""} />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={email} disabled className="opacity-60" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}

export function OrganizationForm({
  name,
  industry,
  slug
}: {
  name: string;
  industry: string | null;
  slug: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => startTransition(() => updateOrganizationAction(fd))}
      className="grid max-w-md gap-4"
    >
      <div className="space-y-2">
        <Label htmlFor="org-name">Company name</Label>
        <Input id="org-name" name="name" defaultValue={name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Input id="industry" name="industry" defaultValue={industry ?? ""} />
      </div>
      <div className="space-y-2">
        <Label>Workspace slug</Label>
        <Input value={slug} disabled className="opacity-60" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save company settings"}
      </Button>
    </form>
  );
}

export function NotificationForm({
  notifyFollowUpReminders,
  notifyEmailDigest
}: {
  notifyFollowUpReminders: boolean;
  notifyEmailDigest: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => startTransition(() => updateNotificationAction(fd))}
      className="grid max-w-md gap-4"
    >
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="notifyFollowUpReminders"
          defaultChecked={notifyFollowUpReminders}
          className="h-4 w-4 rounded border-white/20"
        />
        <span>Follow-up reminders</span>
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="notifyEmailDigest"
          defaultChecked={notifyEmailDigest}
          className="h-4 w-4 rounded border-white/20"
        />
        <span>Weekly email digest</span>
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save notifications"}
      </Button>
    </form>
  );
}
