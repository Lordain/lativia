import {
    ensureOrderWorkspace,
  } from "@/lib/workspaces/ensureOrderWorkspace";
  
  
  /*
   * =========================================
   * safeEnsureOrderWorkspace
   * =========================================
   *
   * Workspace 属于付款完成后的业务 side effect。
   *
   * 核心原则：
   *
   * Payment 已经确认成功以后，
   * Workspace 创建失败不能把付款表现成失败。
   *
   * 失败时：
   * - 记录服务器 Error
   * - 返回 null
   * - 后续可以通过 retry / reconciliation 补建
   *
   * ensureOrderWorkspace 本身具有幂等能力，
   * 所以重复调用安全。
   */
  
  export async function safeEnsureOrderWorkspace(
    orderId:
      string
  ) {
    try {
      return await ensureOrderWorkspace(
        orderId
      );
    } catch (error) {
      console.error(
        "safeEnsureOrderWorkspace error:",
        {
          orderId,
          error,
        }
      );
  
      return null;
    }
  }