import {
    resend,
  } from "@/lib/email/resend";
  
  import type {
    SendEmailInput,
    SendEmailResult,
  } from "@/lib/email/types";
  
  
  export async function sendEmail(
    input:
      SendEmailInput
  ): Promise<
    SendEmailResult
  > {
    const from =
      process.env
        .EMAIL_FROM;
  
  
    if (!from) {
      throw new Error(
        "EMAIL_FROM_NOT_CONFIGURED"
      );
    }
  
  
    const {
      data,
      error,
    } =
      await resend.emails.send({
        from,
  
        to:
          input.to,
  
        subject:
          input.subject,
  
        html:
          input.html,
  
        text:
          input.text,
  
        replyTo:
          input.replyTo ??
          undefined,
      });
  
  
    if (
      error ||
      !data?.id
    ) {
      throw new Error(
        error?.message ??
        "RESEND_SEND_FAILED"
      );
    }
  
  
    return {
      provider:
        "resend",
  
      providerMessageId:
        data.id,
    };
  }