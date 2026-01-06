import resources from "../../resources/resources";

// Initiates Supabase OAuth flow for Apple sign-in.
export default async function appleSignIn() {
  try {
    const supabase = resources.config.supabaseClient;
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return;
    }

    // Preserve redirect parameter from current URL (for Hushh AI and other modules)
    const currentParams = new URLSearchParams(window.location.search);
    const redirectPath = currentParams.get('redirect');
    
    let redirectTo = resources.config.redirect_url || `${window.location.origin}/auth/callback`;
    
    // If there's a redirect param, append it to the callback URL
    if (redirectPath) {
      redirectTo = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`;
    }
    
    console.info("[Hushh][AppleSignIn] Starting Apple OAuth", { redirectTo });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo,
        scopes: "name email",
      },
    });

    if (error) {
      console.error("Supabase Apple sign-in failed:", error);
      return;
    }

    if (data?.url) {
      window.location.assign(data.url);
    }
  } catch (error) {
    console.error("Supabase Apple Sign-In failed:", error);
  }
}
