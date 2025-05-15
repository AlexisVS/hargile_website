// app/api/contact/route.js
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn(
    // IMPORTANT: Keep this for server startup diagnostics
    "CRITICAL WARNING (API /api/contact): SENDGRID_API_KEY is not set. Email sending WILL FAIL."
  );
}

export async function POST(req) {
  if (!process.env.SENDGRID_API_KEY) {
    console.error(
      // IMPORTANT: Keep for runtime diagnostics
      "RUNTIME ERROR (API /api/contact): SendGrid API Key is not configured."
    );
    return NextResponse.json(
      { success: false, messageKey: "submitErrorServiceDown" }, // New key for service config issue
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, phone, object, description, services } = body;

    // --- Server-Side Validation ---
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          messageKey: "validation.nameRequired",
          field: "name",
        },
        { status: 400 }
      );
    }
    if (
      !email ||
      typeof email !== "string" ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      return NextResponse.json(
        {
          success: false,
          messageKey: "validation.emailInvalid",
          field: "email",
        },
        { status: 400 }
      );
    }
    if (!object || typeof object !== "string" || object.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          messageKey: "validation.objectRequired",
          field: "object",
        },
        { status: 400 }
      );
    }
    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          messageKey: "validation.messageRequired", // Assuming messageRequired is for description
          field: "description",
          values: { min: 10 },
        },
        { status: 400 }
      ); // Pass values if key needs them
    }
    if (!services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        {
          success: false,
          messageKey: "validation.serviceRequired",
          field: "services",
        },
        { status: 400 }
      );
    }
    if (phone && (typeof phone !== "string" || phone.length > 30)) {
      return NextResponse.json(
        {
          success: false,
          messageKey: "validation.phoneInvalid",
          field: "phone",
        },
        { status: 400 }
      ); // Add a key for this
    }
    // --- End Server-Side Validation ---

    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    const toEmail = process.env.CONTACT_FORM_TO_EMAIL;

    if (!fromEmail || !toEmail) {
      console.error(
        // IMPORTANT: Keep for runtime diagnostics
        "CONFIGURATION ERROR (API /api/contact): SENDGRID_FROM_EMAIL or CONTACT_FORM_TO_EMAIL is not set."
      );
      return NextResponse.json(
        { success: false, messageKey: "submitErrorConfigMissing" }, // New key for this
        { status: 500 }
      );
    }

    const htmlEmailContent = `
      <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';margin:0;padding:0;background-color:#f4f4f7;color:#333}
          .container{max-width:600px;margin:20px auto;padding:25px;background-color:#fff;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,.1);border:1px solid #e1e1e6}
          .header{text-align:center;padding-bottom:20px;border-bottom:1px solid #eee}.header h1{margin:0;font-size:24px;color:#2c3e50}
          .content-section{margin-top:20px}.content-section h2{font-size:18px;color:#34495e;margin-top:0;margin-bottom:10px;border-bottom:1px dashed #ddd;padding-bottom:5px}
          .content-section p,.content-section li{font-size:15px;line-height:1.6;color:#555}
          .content-section strong{color:#2c3e50}
          .message-box{background-color:#f9f9fc;border:1px solid #e1e1e6;padding:15px;border-radius:5px;margin-top:10px;white-space:pre-wrap}
          ul{list-style-type:none;padding-left:0}li{margin-bottom:8px}
          .footer{text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#888}
          a{color:#3498db;text-decoration:none}a:hover{text-decoration:underline}
      </style></head><body><div class="container"><div class="header"><>Nouveau message depuis le formulaire de contact</div>
      <div class="content-section"><h2>From: ${name
        .replace(/</g, "<")
        .replace(/>/g, ">")}</h2><ul>
      <li><strong>Name:</strong> ${name
        .replace(/</g, "<")
        .replace(/>/g, ">")}</li>
      <li><strong>Email:</strong> <a href="mailto:${email}">${email
      .replace(/</g, "<")
      .replace(/>/g, ">")}</a></li>
      ${
        phone
          ? `<li><strong>Phone:</strong> ${phone
              .replace(/</g, "<")
              .replace(/>/g, ">")}</li>`
          : ""
      }</ul></div>
      <div class="content-section"><h2>Inquiry Details</h2><ul>
      <li><strong>Subject:</strong> ${
        object ? object.replace(/</g, "<").replace(/>/g, ">") : "N/A"
      }</li></ul></div>
      ${
        services && services.length > 0
          ? `<div class="content-section"><h2>Services Interested In</h2><ul>
      ${services
        .map(
          (service) =>
            `<li>${service.replace(/</g, "<").replace(/>/g, ">")}</li>`
        )
        .join("")}</ul></div>`
          : ""
      }
      <div class="content-section"><h2>Message</h2><div class="message-box"><p>${description
        .replace(/</g, "<")
        .replace(/>/g, ">")}</p></div></div>
      <div class="footer"><p>Ce mail est envoyé depuis le formulaire de contact sur hargile.com</p>
      <p>© ${new Date().getFullYear()} Hargile. All rights reserved.</p></div></div></body></html>
    `;

    const textEmailContent = `
Nouveau message depuis le formulaire de contact Hargile
-------------------------------------------------
FROM: Name: ${name} Email: ${email} ${phone ? `Phone: ${phone}` : ""}
INQUIRY DETAILS: Subject: ${object || "N/A"}
${
  services && services.length > 0
    ? `SERVICES INTERESTED IN:\n${services
        .map((service) => `- ${service}`)
        .join("\n")}`
    : ""
}
MESSAGE: ${description}
-------------------------------------------------
Ce mail est envoyé depuis le formulaire de contact sur hargile.com. © ${new Date().getFullYear()} Hargile.
    `;

    const emailData = {
      to: toEmail,
      from: {
        email: fromEmail,
        name: `Hargile Website (${name.replace(/["<>]/g, "")})`,
      },
      replyTo: email,
      subject: `Hargile Contact: ${
        object ? object.substring(0, 70).replace(/[\r\n]/g, " ") : "New Inquiry"
      } from ${name.substring(0, 50).replace(/[\r\n]/g, " ")}`,
      text: textEmailContent.trim(),
      html: htmlEmailContent,
    };

    try {
      await sgMail.send(emailData);
      return NextResponse.json(
        { success: true, messageKey: "submitSuccess" }, // Send translation key
        { status: 200 }
      );
    } catch (error) {
      console.error(
        // IMPORTANT: Keep for SendGrid specific issues
        "[API /api/contact] SendGrid Error sending email:",
        error.response ? error.response.body : error.message
      );
      return NextResponse.json(
        { success: false, messageKey: "submitErrorProvider" }, // Key for email provider error
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(
      // IMPORTANT: Keep for general processing errors
      "[API /api/contact] Error processing request (e.g., JSON parsing):",
      error
    );
    return NextResponse.json(
      { success: false, messageKey: "submitErrorInternal" }, // Key for internal server error
      { status: 500 }
    );
  }
}
