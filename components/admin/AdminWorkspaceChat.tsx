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
    <div className="mt-8 border-t pt-6">
      {/* =====================================
          Header
      ===================================== */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">
            服务沟通
          </h3>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            此处为客户可见沟通。
            正式资料修正请使用 Customer Action。
          </p>
        </div>


        <span className="shrink-0 text-sm text-gray-500">
          {
            messages.length
          } 条
        </span>
      </div>


      {/* =====================================
          Conversation Window
      ===================================== */}

      <div className="mt-4 overflow-hidden rounded-xl border bg-gray-50">
        <div className="h-[420px] overflow-y-auto p-4 md:p-5">
          {messages.length ===
          0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <p className="font-medium text-gray-700">
                  暂无服务消息
                </p>

                <p className="mt-1 text-sm text-gray-500">
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
                        <p className="mb-1 text-xs font-medium text-gray-500">
                          {
                            fromSystem
                              ? "服务团队"
                              : fromAdmin
                                ? "Admin"
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
                                ? "rounded-tl-sm border bg-white text-gray-800"
                                : "rounded-tr-sm bg-blue-600 text-white"
                            }
                          `}
                        >
                          {deleted ? (
                            <p
                              className={
                                fromAdmin ||
                                fromSystem
                                  ? "italic text-gray-400"
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

                                className="w-full rounded-lg border bg-white p-3 text-sm text-gray-900 outline-none"
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

                                  className="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white"
                                >
                                  保存
                                </button>


                                <button
                                  type="button"

                                  onClick={
                                    cancelEdit
                                  }

                                  className="rounded-md border bg-white px-3 py-1.5 text-xs text-gray-700"
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


                        {/* =====================================
                            Meta / Controls
                        ===================================== */}

                        <div
                          className={`
                            mt-1
                            flex
                            flex-wrap
                            items-center
                            gap-2
                            text-xs
                            text-gray-400
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

                                className="text-purple-600 hover:underline"
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

                                className="text-red-600 hover:underline disabled:opacity-50"
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


        {/* =====================================
            Input
        ===================================== */}

        <div className="border-t bg-white p-4">
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