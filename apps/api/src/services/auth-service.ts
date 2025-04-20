import fs from "node:fs/promises";
import handlebars from "handlebars";
import { TokenType } from "@prisma/client";

import { resend } from "../configs/resend.js";
import { AppError } from "../errors/app-error.js";
import { prisma } from "../configs/prisma.js";

export async function sendEmail({
  email,
  emailLink,
  templatePath,
  subject,
  from,
}: {
  email: string;
  emailLink: string;
  templatePath: string;
  from: string;
  subject: string;
}) {
  try {
    const templateSource = await fs.readFile(templatePath, "utf-8");
    const compiledTemplate = handlebars.compile(templateSource.toString());
    const htmlTemplate = compiledTemplate({
      link: emailLink,
    });

    await resend.emails.send({
      from,
      to: email,
      subject,
      html: htmlTemplate,
    });
  } catch (error) {
    console.error(error);
    throw new AppError(`Bad Request: Error sending registration email`, 400);
  }
}

export async function updateTokenUsage({
  userId,
  type,
}: {
  userId: string;
  type: TokenType;
}) {
  try {
    await prisma.token.updateMany({
      where: { userId },
      data: { isUsed: true, type },
    });
  } catch (error) {
    console.error(error);
    throw new AppError("Error updating token usage", 500);
  }
}
