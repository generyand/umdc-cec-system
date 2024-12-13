import nodemailer from "nodemailer";

// Create transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_APP_PASSWORD, // Gmail app-specific password
  },
});

interface EmailParams {
  to: string;
  subject: string;
  body: string;
}

const createEmailTemplate = ({
  recipientName,
  proposalTitle,
  submittedBy,
  submittedDate,
}: {
  recipientName: string;
  proposalTitle: string;
  submittedBy: string;
  submittedDate: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Action Required: Proposal Review</title>
</head>
<body style="
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  background-color: #f4f4f5;
  color: #18181b;
">
  <div style="
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
  ">
    <!-- Logo Section -->
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="${process.env.CLIENT_URL}/logo.png" alt="Logo" style="height: 40px;">
    </div>

    <div style="
      background-color: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    ">
      <!-- Priority Badge -->
      <div style="margin-bottom: 32px;">
        <span style="
          background-color: #fef2f2;
          color: #dc2626;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 500;
        ">Action Required</span>
      </div>

      <!-- Main Content -->
      <div style="color: #3f3f46;">
        <h1 style="
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 24px 0;
          color: #18181b;
        ">Pending Proposal Review</h1>

        <p style="margin: 0 0 24px 0;">Hi ${recipientName},</p>
        
        <p style="
          margin: 0 0 32px 0;
          color: #52525b;
        ">A proposal requires your attention and has been pending for more than 3 days.</p>

        <!-- Proposal Details Card -->
        <div style="
          background-color: #fafafa;
          border: 1px solid #e4e4e7;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        ">
          <div style="margin-bottom: 16px;">
            <div style="font-size: 13px; color: #71717a; margin-bottom: 4px;">
              PROPOSAL TITLE
            </div>
            <div style="font-weight: 500; color: #18181b;">
              ${proposalTitle}
            </div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <div style="font-size: 13px; color: #71717a; margin-bottom: 4px;">
              SUBMITTED BY
            </div>
            <div style="font-weight: 500; color: #18181b;">
              ${submittedBy}
            </div>
          </div>
          
          <div>
            <div style="font-size: 13px; color: #71717a; margin-bottom: 4px;">
              SUBMISSION DATE
            </div>
            <div style="font-weight: 500; color: #18181b;">
              ${submittedDate}
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${process.env.CLIENT_URL}/proposals" style="
            background-color: #2563eb;
            color: white;
            padding: 12px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            display: inline-block;
            transition: background-color 0.2s;
          ">Review Proposal →</a>
        </div>

        <p style="
          margin: 32px 0;
          padding: 16px;
          border-left: 4px solid #e4e4e7;
          color: #52525b;
          font-size: 15px;
        ">
          If you're unable to access the proposal or have any questions, please contact the system administrator.
        </p>
      </div>

      <!-- Footer -->
      <div style="
        margin-top: 40px;
        padding-top: 24px;
        border-top: 1px solid #e4e4e7;
      ">
        <p style="
          margin: 0;
          color: #a1a1aa;
          font-size: 14px;
          text-align: center;
        ">
          This is an automated message from the Project Management System.
          Please do not reply to this email.
        </p>
      </div>
    </div>

    <!-- Footer Links -->
    <div style="
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: #71717a;
    ">
      <p style="margin: 0 0 12px 0;">
        Project Management System
      </p>
      <div>
        <a href="#" style="color: #71717a; text-decoration: none; margin: 0 8px;">Help Center</a>
        •
        <a href="#" style="color: #71717a; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
        •
        <a href="#" style="color: #71717a; text-decoration: none; margin: 0 8px;">Terms of Service</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Update the sendEmail function to use the template
export const sendEmail = async ({ to, subject, body }: EmailParams) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: body, // Plain text version
      html: createEmailTemplate({
        recipientName: "Yow",
        proposalTitle: "Test Proposal",
        submittedBy: "John Doe",
        submittedDate: new Date().toLocaleDateString(),
      }),
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
