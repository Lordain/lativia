import {
    ensureWorkspaceWelcomeMessage,
  } from "@/lib/workspaces/ensureWorkspaceWelcomeMessage";
  
  
  export async function safeEnsureWorkspaceWelcomeMessage(
    workspaceId:
      string
  ) {
    try {
      return await ensureWorkspaceWelcomeMessage(
        workspaceId
      );
  
    } catch {
      console.error(
        "safeEnsureWorkspaceWelcomeMessage failed",
        {
          workspaceId,
        }
      );
  
  
      return null;
    }
  }