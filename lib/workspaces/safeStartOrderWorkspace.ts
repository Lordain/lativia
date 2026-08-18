import {
    startOrderWorkspace,
  } from "@/lib/workspaces/startOrderWorkspace";
  
  
  /*
   * =========================================
   * safeStartOrderWorkspace
   * =========================================
   *
   * Fulfillment 状态改变已经成功以后，
   * Workspace timer 属于后续 side effect。
   *
   * Workspace timer 失败不能把已经成功的
   * Fulfillment transition 表现为失败。
   */
  
  export async function safeStartOrderWorkspace(
    orderId:
      string
  ) {
    try {
      return await startOrderWorkspace(
        orderId
      );
    } catch (error) {
      console.error(
        "safeStartOrderWorkspace error:",
        {
          orderId,
          error,
        }
      );
  
      return null;
    }
  }