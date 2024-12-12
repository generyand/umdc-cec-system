import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  body: string;
}

export const sendEmail = async ({ to, subject, body }: EmailParams) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Onboarding <onboarding@resend.dev>",
      to,
      subject,
      html: `<div style="font-family: Arial, sans-serif;">${body.replace(
        /\n/g,
        "<br>"
      )}</div>`,
    });

    if (error) {
      throw error;
    }

    console.log("Email sent successfully");
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
