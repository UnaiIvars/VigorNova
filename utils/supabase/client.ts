import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const url = rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    "placeholder-anon-key";

  return createBrowserClient(url, key);
};
