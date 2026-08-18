import {
    requireAdmin,
  } from "@/lib/auth/requireAdmin";
  
  import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  
  export async function getServiceWorkspaceWelcomeMessage(
    serviceId:
      string
  ) {
    await requireAdmin();
  
  
    const admin =
      createAdminClient();
  
  
    const {
      data,
      error,
    } =
      await admin
        .from(
          "services"
        )
        .select(`
          workspace_welcome_message
        `)
        .eq(
          "id",
          serviceId
        )
        .maybeSingle();
  
  
    if (error) {
      console.error(
        "getServiceWorkspaceWelcomeMessage error:",
        error
      );
  
      throw new Error(
        "读取 Workspace 欢迎消息失败"
      );
    }
  
  
    return (
      data
        ?.workspace_welcome_message ??
      ""
    );
  }