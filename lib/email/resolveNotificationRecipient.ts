import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  
  interface ResolveNotificationRecipientInput {
    userId: string;
  }
  
  
  export async function resolveNotificationRecipient(
    input:
      ResolveNotificationRecipientInput
  ): Promise<string | null> {
    /*
     * ========================================
     * Development Override
     * ========================================
     *
     * 只要 EMAIL_TEST_RECIPIENT 有配置，
     * 所有开发邮件统一进入测试邮箱。
     *
     * 这样不会误发给真实客户。
     */
  
    const testRecipient =
      process.env
        .EMAIL_TEST_RECIPIENT
        ?.trim();
  
  
    if (testRecipient) {
      return testRecipient;
    }
  
  
    /*
     * ========================================
     * Production Recipient
     * ========================================
     *
     * profiles 当前没有 email。
     *
     * 正式客户邮箱来自 Supabase Auth。
     */
  
    const admin =
      createAdminClient();
  
  
    const {
      data,
      error,
    } =
      await admin.auth.admin
        .getUserById(
          input.userId
        );
  
  
    if (
      error ||
      !data.user
    ) {
      console.error(
        "resolveNotificationRecipient auth user lookup error:",
        {
          userId:
            input.userId,
  
          error,
        }
      );
  
  
      return null;
    }
  
  
    const email =
      data.user.email
        ?.trim();
  
  
    if (!email) {
      console.warn(
        "resolveNotificationRecipient skipped: user has no email",
        {
          userId:
            input.userId,
        }
      );
  
  
      return null;
    }
  
  
    return email;
  }