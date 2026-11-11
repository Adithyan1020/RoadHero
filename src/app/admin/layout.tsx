import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

// Only users with role ADMIN can open /admin.
// To make yourself an admin, set your row's role to ADMIN in the
// Supabase Table Editor (User table).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/");
  return <>{children}</>;
}
