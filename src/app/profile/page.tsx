import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { ensureProfile, getUserProfile } from "@/lib/actions/index";

export const metadata: Metadata = {
  title: "الملف الشخصي",
};

export default async function ProfilePage() {
  await ensureProfile();
  const profile = await getUserProfile();

  return (
    <AppLayout>
      <div className="container-app py-12">
        <PageHeader
          title="الملف الشخصي"
          description="حدّث بياناتك للحصول على نتائج أدق"
        />
        <div className="max-w-2xl">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </AppLayout>
  );
}
