import { LoginForm } from "@/components/admin/login-form";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect("/cv-admin");
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
