"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import AdminWorkspaceMessageForm from "@/components/admin/AdminWorkspaceMessageForm";

import {
  editAdminWorkspaceMessage,
} from "@/lib/workspaces/editAdminWorkspaceMessage";

import {
  deleteAdminWorkspaceMessage,
} from "@/lib/workspaces/deleteAdminWorkspaceMessage";

import type {
  WorkspaceMessage,
} from "@/types/workspace";


interface Props {
  workspaceId:
    string;

  workspaceStatus:
    string;

  messages:
    WorkspaceMessage[];
}


function formatTime(
  value:
    string
) {
  return new Date(
    value
  ).toLocaleString();
}


export default function AdminWorkspaceChat({
  workspaceId,
  workspaceStatus,
  messages,
}: Props) {
  const router =
    useRouter();


  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );


  const [
    editingId,
    setEditingId,
  ] =
    useState<
      string | null
    >(
      null
    );


  const [
    editingValue,
    setEditingValue,
  ] =
    useState(
      ""
    );


  const [
    loadingId,
    setLoadingId,
  ] =
    useState<
      string | null
    >(
      null
    );


  useEffect(
    () => {
      bottomRef.current
        ?.scrollIntoView({
          behavior:
            "smooth",
        });
    },
    [
      messages.length,
    ]
  );


  function startEdit(
    message:
      WorkspaceMessage
  ) {
    if (
      message.deletedAt
    ) {
      return;
    }


    setEditingId(
      message.id
    );

    setEditingValue(
      message.message
    );
  }


  function cancelEdit() {
    setEditingId(
      null
    );

    setEditingValue(
      ""
    );
  }


  async function saveEdit(
    message:
      WorkspaceMessage
  ) {
    const cleanValue =
      editingValue.trim();


    if (!cleanValue) {
      alert(
        "消息不能为空"
      );

      return;
    }


    setLoadingId(
      message.id
    );


    try {
      await editAdminWorkspaceMessage(
        message.id,
        cleanValue
      );


      cancelEdit();

      router.refresh();

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "编辑消息失败"
      );

    } finally {
      setLoadingId(
        null
      );
    }
  }


  async function handleDelete(
    message:
      WorkspaceMessage
  ) {
    const confirmed =
      window.confirm(
        "确定删除这条消息吗？客户将看到「此消息已删除」，但系统仍保留记录。"
      );


    if (!confirmed) {
      return;
    }


    setLoadingId(
      message.id
    );


    try {
      await deleteAdminWorkspaceMessage(
        message.id
      );

      router.refresh();

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "删除消息失败"
      );

    } finally {
      setLoadingId(
        null
      );
    }
  }


  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-950">
            服务沟通
          </h4>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            此处内容客户可见。正式资料修正请使用客户资料与待办流程。
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {
            messages.length
          } 条
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
        <div className="h-[420px] overflow-y-auto p-4 md:p-5">
          {messages.length ===
          0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                  </svg>
                </div>

                <p className="mt-4 font-semibold text-slate-700">
                  暂无服务消息
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  可以在下方发送第一条客户可见消息。
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map(
                message => {
                  const fromAdmin =
                    message.senderType ===
                    "admin";


                  const fromSystem =
                    message.senderType ===
                    "system";


                  const deleted =
                    Boolean(
                      message.deletedAt
                    );


                  const editing =
                    editingId ===
                    message.id;


                  return (
                    <div
                      key={
                        message.id
                      }
                      className={
                        fromAdmin ||
                        fromSystem
                          ? "flex justify-start"
                          : "flex justify-end"
                      }
                    >
                      <div
                        className={`
                          max-w-[85%]
                          md:max-w-[70%]
                          ${
                            fromAdmin ||
                            fromSystem
                              ? "text-left"
                              : "text-right"
                          }
                        `}
                      >
                        <p className="mb-1 text-xs font-medium text-slate-500">
                          {
                            fromSystem
                              ? "服务团队"
                              : fromAdmin
                                ? "管理员"
                                : "客户"
                          }
                        </p>

                        <div
                          className={`
                            rounded-2xl
                            px-4
                            py-3
                            text-sm
                            leading-6
                            shadow-sm
                            ${
                              fromAdmin ||
                              fromSystem
                                ? "rounded-tl-sm border border-slate-200 bg-white text-slate-800"
                                : "rounded-tr-sm bg-blue-600 text-white"
                            }
                          `}
                        >
                          {deleted ? (
                            <p
                              className={
                                fromAdmin ||
                                fromSystem
                                  ? "italic text-slate-400"
                                  : "italic text-blue-100"
                              }
                            >
                              此消息已删除
                            </p>
                          ) : editing ? (
                            <div>
                              <textarea
                                value={
                                  editingValue
                                }
                                onChange={
                                  event =>
                                    setEditingValue(
                                      event.target.value
                                    )
                                }
                                rows={
                                  4
                                }
                                maxLength={
                                  10000
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                              />

                              <div className="mt-2 flex gap-2">
                                <button
                                  type="button"
                                  onClick={
                                    () =>
                                      saveEdit(
                                        message
                                      )
                                  }
                                  disabled={
                                    loadingId ===
                                    message.id
                                  }
                                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                  保存
                                </button>

                                <button
                                  type="button"
                                  onClick={
                                    cancelEdit
                                  }
                                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                  取消
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap break-words">
                              {
                                message.message
                              }
                            </p>
                          )}
                        </div>

                        <div
                          className={`
                            mt-1
                            flex
                            flex-wrap
                            items-center
                            gap-2
                            text-xs
                            text-slate-400
                            ${
                              fromAdmin ||
                              fromSystem
                                ? "justify-start"
                                : "justify-end"
                            }
                          `}
                        >
                          <span>
                            {
                              formatTime(
                                message.createdAt
                              )
                            }
                          </span>

                          {message.editedAt &&
                            !deleted && (
                            <span>
                              · 已编辑
                            </span>
                          )}

                          {fromAdmin &&
                            !deleted &&
                            !editing && (
                            <>
                              <button
                                type="button"
                                onClick={
                                  () =>
                                    startEdit(
                                      message
                                    )
                                }
                                className="font-medium text-blue-600 hover:underline"
                              >
                                编辑
                              </button>

                              <button
                                type="button"
                                onClick={
                                  () =>
                                    handleDelete(
                                      message
                                    )
                                }
                                disabled={
                                  loadingId ===
                                  message.id
                                }
                                className="font-medium text-red-600 hover:underline disabled:opacity-50"
                              >
                                删除
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}

              <div
                ref={
                  bottomRef
                }
              />
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-4">
          <AdminWorkspaceMessageForm
            workspaceId={
              workspaceId
            }
            disabled={
              workspaceStatus !==
              "active"
            }
          />
        </div>
      </div>
    </div>
  );
}
