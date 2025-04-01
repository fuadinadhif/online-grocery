import fs from "node:fs/promises";
import handlebars from "handlebars";

import { resend } from "../../configs/resend.js";
import { AppError } from "../../errors/app-error.js";

export async function sendRegistrationEmail(
  email: string,
  emailVerificationLink: string
) {
  try {
    const templateSource = await fs.readFile(
      "src/templates/complete-registration-template.hbs",
      "utf-8"
    );
    const compiledTemplate = handlebars.compile(templateSource.toString());
    const htmlTemplate = compiledTemplate({
      link: emailVerificationLink,
    });

    await resend.emails.send({
      from: "OnlineGrocery <onboarding@killthemagic.dev>",
      to: email,
      subject: "Complete Registration",
      html: htmlTemplate,
    });
  } catch (error) {
    console.error(error);
    throw new AppError(`Bad Request: Error sending registration email`, 400);
  }
}
