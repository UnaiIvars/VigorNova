import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://grxzosutjksgaxtbreym.supabase.co";

  const url = rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

  const rawKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    "sb_publishable_2meCo0Fclqbk3bzvG47Ytw_lQmBgB6M";

  const key = rawKey.trim().replace(/['"]/g, '');

  return createBrowserClient(url, key);
};
