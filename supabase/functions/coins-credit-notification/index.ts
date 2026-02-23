import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** Build NDA-style black & white HTML email for Hushh Coins credit */
const buildCoinsEmailHtml = (name: string, coins: number, date: string) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:0;">

        <!-- Black Header -->
        <tr><td style="background-color:#000000;padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">HUSHH</h1>
          <p style="margin:6px 0 0;color:#999999;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Coins Credit Confirmation</p>
        </td></tr>

        <!-- Coins Hero -->
        <tr><td style="padding:40px 40px 24px;text-align:center;">
          <p style="margin:0 0 8px;color:#666666;font-size:14px;">Your Hushh Coins have been credited</p>
          <p style="margin:0;color:#000000;font-size:48px;font-weight:800;letter-spacing:-1px;">${coins.toLocaleString()}</p>
          <p style="margin:4px 0 0;color:#000000;font-size:16px;font-weight:600;">Hushh Coins 🪙</p>
        </td></tr>

        <!-- Black bordered details box -->
        <tr><td style="padding:0 40px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #000000;">
            <tr style="background-color:#000000;">
              <td style="padding:10px 16px;color:#ffffff;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;" colspan="2">Transaction Details</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e5e5;">
              <td style="padding:12px 16px;font-size:13px;color:#666666;width:40%;">Recipient</td>
              <td style="padding:12px 16px;font-size:13px;color:#000000;font-weight:600;">${name}</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e5e5;">
              <td style="padding:12px 16px;font-size:13px;color:#666666;">Coins Credited</td>
              <td style="padding:12px 16px;font-size:13px;color:#000000;font-weight:600;">${coins.toLocaleString()} HC</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e5e5;">
              <td style="padding:12px 16px;font-size:13px;color:#666666;">Equivalent Value</td>
              <td style="padding:12px 16px;font-size:13px;color:#000000;font-weight:600;">$${(coins / 100).toLocaleString()}</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e5e5;">
              <td style="padding:12px 16px;font-size:13px;color:#666666;">Date</td>
              <td style="padding:12px 16px;font-size:13px;color:#000000;font-weight:600;">${date}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-size:13px;color:#666666;">Status</td>
              <td style="padding:12px 16px;font-size:13px;color:#000000;font-weight:600;">✅ Credited</td>
            </tr>
          </table>
        </td></tr>

        <!-- What you can do -->
        <tr><td style="padding:0 40px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #000000;">
            <tr style="background-color:#000000;">
              <td style="padding:10px 16px;color:#ffffff;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">How To Use Your Coins</td>
            </tr>
            <tr>
              <td style="padding:16px;">
                <p style="margin:0 0 10px;font-size:13px;color:#333333;">🗓️ <strong>Book a Consultation</strong> — Use your coins to schedule a 1-on-1 session with Manish Sainani, Hedge Fund Manager.</p>
                <p style="margin:0 0 10px;font-size:13px;color:#333333;">💼 <strong>Investment Guidance</strong> — Get personalized portfolio allocation and investment strategy advice.</p>
                <p style="margin:0;font-size:13px;color:#333333;">🔒 <strong>KYC Verified</strong> — Your identity verification is complete. You're ready to go.</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- CTA Button -->
        <tr><td style="padding:0 40px 32px;text-align:center;">
          <a href="https://www.hushh.ai/onboarding/meet-ceo" style="display:inline-block;background-color:#000000;color:#ffffff;padding:14px 40px;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.5px;">
            BOOK YOUR SESSION →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #e5e5e5;text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;color:#999999;">This email was sent by Hushh Technologies Pte Ltd.</p>
          <p style="margin:0;font-size:11px;color:#999999;">© ${new Date().getFullYear()} Hushh. All rights reserved.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientName, coinsAwarded } = await req.json();

    if (!recipientEmail || !coinsAwarded) {
      return new Response(JSON.stringify({ error: "Missing recipientEmail or coinsAwarded" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const name = recipientName || "Hushh User";
    const coins = Number(coinsAwarded) || 300000;
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    // Send email via Gmail SMTP using denomailer
    const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");
    const gmailUser = Deno.env.get("GMAIL_USER") || "ankit@hushh.ai";
    const gmailPass = Deno.env.get("GMAIL_APP_PASSWORD") || "";

    const client = new SMTPClient({
      connection: { hostname: "smtp.gmail.com", port: 587, tls: true, auth: { username: gmailUser, password: gmailPass } },
    });

    await client.send({
      from: `"Hushh Technologies" <${gmailUser}>`,
      to: recipientEmail,
      subject: `🪙 ${coins.toLocaleString()} Hushh Coins Credited to Your Account`,
      html: buildCoinsEmailHtml(name, coins, date),
    });

    await client.close();

    console.log(`✅ Coins email sent to ${recipientEmail}: ${coins} coins`);

    return new Response(JSON.stringify({ success: true, message: "Coins credit email sent" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("❌ Coins email error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to send email" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
