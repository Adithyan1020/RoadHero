import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
let resendClient: Resend | null = null;

if (resendApiKey) {
  resendClient = new Resend(resendApiKey);
}

export async function sendEmergencyEmail(to: string, problemType: string, lat: number, lng: number) {
  if (!resendClient) {
    console.warn("Resend client not initialized. Skipping email notification.");
    console.log(`[MOCK EMAIL to ${to}]: New emergency - ${problemType} at ${lat}, ${lng}`);
    return false;
  }

  try {
    await resendClient.emails.send({
      from: "RoadRescue <onboarding@resend.dev>", // Replace with your verified domain in production
      to: to,
      subject: "🚨 URGENT: New Emergency Request on RoadRescue",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #e11d48;">🚨 Urgent: New Emergency Request</h2>
          <p>A driver nearby needs your help immediately.</p>
          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Problem:</strong> ${problemType}</p>
            <p><strong>Location:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
          </div>
          <p>Please log in to your RoadRescue Provider Dashboard to accept this job.</p>
          <a href="https://roadrescue.com/provider/dashboard" style="display: inline-block; background-color: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Dashboard</a>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
