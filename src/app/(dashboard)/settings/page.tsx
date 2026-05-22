import Link from "next/link";
import { PageHeader } from "@/components/crm/page-header";
import {
  NotificationForm,
  OrganizationForm,
  ProfileForm
} from "@/components/settings/settings-forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireOrganizationId } from "@/lib/org";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const { userId, organizationId } = await requireOrganizationId();

  const [user, org] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.organization.findUniqueOrThrow({ where: { id: organizationId } })
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Manage your profile, company, and notification preferences."
      />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-white/[0.06] bg-[#111113]">
            <CardHeader>
              <CardTitle>Profile settings</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm name={user.name} title={user.title} email={user.email} />
              <p className="mt-6 text-sm text-white/40">
                <Link href="/forgot-password" className="text-white/60 hover:text-white">
                  Reset your password
                </Link>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card className="border-white/[0.06] bg-[#111113]">
            <CardHeader>
              <CardTitle>Company settings</CardTitle>
            </CardHeader>
            <CardContent>
              <OrganizationForm name={org.name} industry={org.industry} slug={org.slug} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-white/[0.06] bg-[#111113]">
            <CardHeader>
              <CardTitle>Notification settings</CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationForm
                notifyFollowUpReminders={user.notifyFollowUpReminders}
                notifyEmailDigest={user.notifyEmailDigest}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
