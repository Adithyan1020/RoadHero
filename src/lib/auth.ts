import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Returns the signed-in user's row from our own User table, or null if
 * nobody is signed in. Supabase handles login; the first time a Supabase
 * user shows up we create the matching User row (role USER).
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;

  const claims = data.claims;
  const authId = claims.sub;
  const email = claims.email as string | undefined;
  if (!authId || !email) return null;

  const meta = (claims.user_metadata ?? {}) as { name?: string; phone?: string };

  return prisma.user.upsert({
    where: { authId },
    update: { email },
    create: {
      authId,
      email,
      name: meta.name ?? null,
      phone: meta.phone ?? null,
    },
  });
}

/** Only allows relative paths like "/emergency", to prevent open redirects. */
export function safeNextPath(next: string | null | undefined, fallback = "/") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}
