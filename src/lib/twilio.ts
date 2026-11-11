import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

let client: twilio.Twilio | null = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export async function sendWhatsAppNotification(to: string, message: string) {
  if (!client) {
    console.warn("Twilio client not initialized. Skipping WhatsApp notification.");
    console.log(`[MOCK WHATSAPP to ${to}]: ${message}`);
    return false;
  }

  try {
    const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
    await client.messages.create({
      body: message,
      from: twilioWhatsAppNumber,
      to: formattedTo,
    });
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return false;
  }
}
