"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import CustomerWorkspaceMessageForm from "@/components/orders/CustomerWorkspaceMessageForm";

import {
  editCustomerWorkspaceMessage,
} from "@/lib/workspaces/editCustomerWorkspaceMessage";

import {
  deleteCustomerWorkspaceMessage,
} from "@/lib/workspaces/deleteCustomerWorkspaceMessage";

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


export default function CustomerWorkspaceChat({
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

  const scrollContainerRef =
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
        const container =
          scrollContainerRef.current;

        if (!container) {
          return;
        }


        container.scrollTo({
          top:
            container.scrollHeight,

          behavior:
            "smooth",
        });
      },
      [
        messages.length,
      ]
    );


    useEffect(
      () => {
        const intervalId =
          window.setInterval(
            () => {
              router.refresh();
            },
            4000
          );


        return () => {
          window.clearInterval(
            intervalId
          );
        };
      },
      [
        router,
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
      await editCustomerWorkspaceMessage(
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
        "确定删除这条消息吗？页面将显示「此消息已删除」。"
      );


    if (!confirmed) {
      return;
    }


    setLoadingId(
      message.id
    );


    try {
      await deleteCustomerWorkspaceMessage(
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

      <div>
        <h3 className="text-lg font-semibold">
          服务沟通
        </h3>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          可在这里与服务人员沟通订单办理事项。
          正式资料修正会显示在上方「需要您处理」。
        </p>
      </div>


      {/* =====================================
          Chat Window
      ===================================== */}

      <div className="mt-4 overflow-hidden rounded-2xl border bg-gray-50">
        <div
            ref={
              scrollContainerRef
            }
            className="h-[420px] overflow-y-auto p-4 md:p-5"
          >
          {messages.length ===
          0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <p className="font-medium text-gray-700">
                  暂无服务消息
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  如有问题，可以直接在下方与服务人员沟通。
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map(
                message => {
                  const mine =
                    message.senderType ===
                    "customer";


                  const system =
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
                        mine
                          ? "flex justify-end"
                          : "flex justify-start"
                      }
                    >
                      <div
                        className={`
                          max-w-[85%]
                          md:max-w-[70%]
                          ${
                            mine
                              ? "text-right"
                              : "text-left"
                          }
                        `}
                      >
                        <p className="mb-1 text-xs font-medium text-gray-500">
                          {
                            mine
                              ? "您"
                              : system
                                ? "服务团队"
                                : "服务人员"
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
                              mine
                                ? "rounded-tr-sm bg-blue-600 text-white"
                                : "rounded-tl-sm border bg-white text-gray-800"
                            }
                          `}
                        >
                          {deleted ? (
                            <p
                              className={
                                mine
                                  ? "italic text-blue-100"
                                  : "italic text-gray-400"
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


                              <div className="mt-2 flex justify-end gap-2">
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

                                  className="rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white"
                                >
                                  保存
                                </button>


                                <button
                                  type="button"

                                  onClick={
                                    cancelEdit
                                  }

                                  className="rounded-md bg-white px-3 py-1.5 text-xs text-gray-700"
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
                            Meta / Own Controls
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
                              mine
                                ? "justify-end"
                                : "justify-start"
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


                          {mine &&
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

                                className="text-blue-600 hover:underline"
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
          <CustomerWorkspaceMessageForm
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