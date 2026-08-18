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
  
    } catch (error) {
      console.error(
        "safeEnsureWorkspaceWelcomeMessage error:",
        {
          workspaceId,
          error,
        }
      );
  
  
      return null;
    }
  }