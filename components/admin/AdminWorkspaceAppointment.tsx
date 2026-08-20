"use client";

import {
  useEffect,
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  MeetingProvider,
  OrderAppointmentData,
} from "@/types/appointment";

import {
  updateAdminAppointmentMeeting,
} from "@/lib/appointments/updateAdminAppointmentMeeting";

import {
  cancelAdminOrderAppointment,
} from "@/lib/appointments/cancelAdminOrderAppointment";


interface Props {
  workspaceId:
    string;

  orderId:
    string;

  data:
    OrderAppointmentData;

  defaultConsultationType?:
    string | null;
}


function formatAppointmentDate(
  value:
    string
) {
  return new Intl.DateTimeFormat(
    "zh-CN",
    {
      timeZone:
        "America/Mexico_City",

      year:
        "numeric",

      month:
        "long",

      day:
        "numeric",

      weekday:
        "short",

      hour:
        "2-digit",

      minute:
        "2-digit",

      hourCycle:
        "h23",
    }
  ).format(
    new Date(
      value
    )
  );
}


function formatTime(
  value:
    string
) {
  return new Intl.DateTimeFormat(
    "zh-CN",
    {
      timeZone:
        "America/Mexico_City",

      hour:
        "2-digit",

      minute:
        "2-digit",

      hourCycle:
        "h23",
    }
  ).format(
    new Date(
      value
    )
  );
}


function getProviderLabel(
  provider:
    MeetingProvider | null
) {
  switch (
    provider
  ) {
    case "zoom":
      return "Zoom";

    case "google_meet":
      return "Google Meet";

    case "microsoft_teams":
      return "Microsoft Teams";

    case "other":
      return "其他";

    default:
      return "未设置";
  }
}


export default function AdminWorkspaceAppointment({
  workspaceId: _workspaceId,
  orderId: _orderId,
  data,
  defaultConsultationType = null,
}: Props) {
  const router =
    useRouter();


  const [
    pending,
    startTransition,
  ] =
    useTransition();


  const [
    meetingProvider,
    setMeetingProvider,
  ] =
    useState<
      MeetingProvider | ""
    >(
      data.appointment
        ?.meetingProvider ??
      ""
    );


  const [
    meetingUrl,
    setMeetingUrl,
  ] =
    useState(
      data.appointment
        ?.meetingUrl ??
      ""
    );


  const [
    meetingTitle,
    setMeetingTitle,
  ] =
    useState(
      data.appointment
        ?.meetingTitle ??
      (
        defaultConsultationType ===
        "cetes_initial_consultation"
          ? "Cetesdirecto 首次开户咨询"
          : ""
      )
    );


  const [
    meetingNotes,
    setMeetingNotes,
  ] =
    useState(
      data.appointment
        ?.meetingNotes ??
      ""
    );


  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(
      null
    );


  const [
    success,
    setSuccess,
  ] =
    useState<
      string | null
    >(
      null
    );


  useEffect(
    () => {
      setMeetingProvider(
        data.appointment
          ?.meetingProvider ??
        ""
      );

      setMeetingUrl(
        data.appointment
          ?.meetingUrl ??
        ""
      );

      setMeetingTitle(
        data.appointment
          ?.meetingTitle ??
        (
          defaultConsultationType ===
          "cetes_initial_consultation"
            ? "Cetesdirecto 首次开户咨询"
            : ""
        )
      );

      setMeetingNotes(
        data.appointment
          ?.meetingNotes ??
        ""
      );
    },
    [
      data.appointment,
      defaultConsultationType,
    ]
  );


  function resetFeedback() {
    setError(
      null
    );

    setSuccess(
      null
    );
  }


  function handleSaveMeeting() {
    if (
      !data.appointment
    ) {
      return;
    }


    resetFeedback();


    startTransition(
      async () => {
        try {
          await updateAdminAppointmentMeeting({
            appointmentId:
              data.appointment!.id,

            meetingProvider,

            meetingUrl,

            meetingTitle,

            meetingNotes,

            consultationType:
              data.appointment
                ?.consultationType ??
              defaultConsultationType ??
              "",
          });


          setSuccess(
            "线上会议信息已经保存"
          );

          router.refresh();

        } catch (
          caught
        ) {
          setError(
            caught instanceof Error
              ? caught.message
              : "保存线上会议失败"
          );
        }
      }
    );
  }


  function handleCancelAppointment() {
    if (
      !data.appointment
    ) {
      return;
    }


    if (
      !window.confirm(
        "确定取消客户当前预约吗？取消后该时间会重新回到预约日历。"
      )
    ) {
      return;
    }


    resetFeedback();


    startTransition(
      async () => {
        try {
          await cancelAdminOrderAppointment(
            data.appointment!.id
          );


          router.refresh();

        } catch (
          caught
        ) {
          setError(
            caught instanceof Error
              ? caught.message
              : "取消预约失败"
          );
        }
      }
    );
  }


  return (
    <section className="rounded-xl border bg-white p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Appointment & Meeting
        </p>

        <h3 className="mt-1 text-lg font-semibold">
          咨询预约与线上会议
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          系统会根据预约规则自动开放未来10天时段，
          客户自行选择当前可用时间。
        </p>
      </div>


      {/* =====================================
          Availability Rule
      ===================================== */}

      {data.rule ? (
        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-900">
                当前预约规则
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Timezone：
                {
                  data.rule.timezone
                }
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              自动开放
            </span>
          </div>


          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">
                营业日
              </p>

              <p className="mt-1 font-medium">
                周一～周六
              </p>
            </div>


            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">
                营业时间
              </p>

              <p className="mt-1 font-medium">
                {
                  data.rule.openTime
                    .slice(
                      0,
                      5
                    )
                }
                –
                {
                  data.rule.closeTime
                    .slice(
                      0,
                      5
                    )
                }
              </p>
            </div>


            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">
                预约时长
              </p>

              <p className="mt-1 font-medium">
                {
                  data.rule.slotMinutes
                } 分钟
              </p>
            </div>


            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">
                开放范围
              </p>

              <p className="mt-1 font-medium">
                未来 {
                  data.rule.bookingWindowDays
                } 天
              </p>
            </div>
          </div>


          <p className="mt-3 text-xs text-gray-500">
            最少提前 {
              data.rule.minimumNoticeHours
            } 小时预约。
            已被其他客户预约的时间会显示为“已占用”。
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-medium text-amber-800">
            当前没有启用的预约规则
          </p>
        </div>
      )}


      {/* =====================================
          No Appointment Yet
      ===================================== */}

      {!data.appointment && (
        <div className="mt-5 rounded-xl border border-dashed border-blue-200 bg-blue-50 p-4">
          <p className="font-semibold text-blue-900">
            等待客户预约
          </p>

          <p className="mt-2 text-sm leading-6 text-blue-700">
            客户可以在订单服务空间中查看未来 10 天的预约时间，并从中选择咨询时间。
          </p>
        </div>
      )}


      {/* =====================================
          Current Appointment
      ===================================== */}

      {data.appointment &&
        data.appointment
          .startsAt &&
        data.appointment
          .endsAt && (
        <>
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-green-800">
                  当前预约已确认
                </p>

                <p className="mt-2 text-lg font-semibold text-green-950">
                  {
                    formatAppointmentDate(
                      data.appointment
                        .startsAt
                    )
                  }
                  {" — "}
                  {
                    formatTime(
                      data.appointment
                        .endsAt
                    )
                  }
                </p>

                <p className="mt-1 text-xs text-green-700">
                  墨西哥城时间
                </p>
              </div>


              <button
                type="button"
                disabled={
                  pending
                }
                onClick={
                  handleCancelAppointment
                }
                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                取消预约
              </button>
            </div>
          </div>


          {/* =================================
              Online Meeting
          ================================= */}

          <div className="mt-5 rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold">
                  线上会议
                </h4>

                <p className="mt-1 text-sm text-gray-500">
                  {
                    data.appointment
                      .meetingStatus ===
                    "ready"
                      ? "会议入口已准备"
                      : "等待设置会议入口"
                  }
                </p>
              </div>


              {data.appointment
                .meetingProvider && (
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                  {
                    getProviderLabel(
                      data.appointment
                        .meetingProvider
                    )
                  }
                </span>
              )}
            </div>


            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className="font-medium text-gray-700">
                  会议工具
                </span>

                <select
                  value={
                    meetingProvider
                  }
                  onChange={
                    event =>
                      setMeetingProvider(
                        event.target
                          .value as
                          MeetingProvider |
                          ""
                      )
                  }
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2.5"
                >
                  <option value="">
                    请选择
                  </option>

                  <option value="zoom">
                    Zoom
                  </option>

                  <option value="google_meet">
                    Google Meet
                  </option>

                  <option value="microsoft_teams">
                    Microsoft Teams
                  </option>

                  <option value="other">
                    其他
                  </option>
                </select>
              </label>


              <label className="text-sm">
                <span className="font-medium text-gray-700">
                  会议主题
                </span>

                <input
                  type="text"
                  value={
                    meetingTitle
                  }
                  onChange={
                    event =>
                      setMeetingTitle(
                        event.target.value
                      )
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2.5"
                  placeholder="例如：Cetesdirecto 首次开户咨询"
                />
              </label>
            </div>


            <label className="mt-4 block text-sm">
              <span className="font-medium text-gray-700">
                会议链接
              </span>

              <input
                type="url"
                value={
                  meetingUrl
                }
                onChange={
                  event =>
                    setMeetingUrl(
                      event.target.value
                    )
                }
                className="mt-1 w-full rounded-lg border px-3 py-2.5"
                placeholder="https://..."
              />
            </label>


            <label className="mt-4 block text-sm">
              <span className="font-medium text-gray-700">
                会议说明
              </span>

              <textarea
                rows={
                  3
                }
                value={
                  meetingNotes
                }
                onChange={
                  event =>
                    setMeetingNotes(
                      event.target.value
                    )
                }
                className="mt-1 w-full rounded-lg border px-3 py-2.5"
                placeholder="例如：请提前 5 分钟进入会议。"
              />
            </label>


            <button
              type="button"
              disabled={
                pending
              }
              onClick={
                handleSaveMeeting
              }
              className="mt-4 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {
                pending
                  ? "保存中..."
                  : "保存会议信息"
              }
            </button>
          </div>
        </>
      )}


      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </p>
      )}
    </section>
  );
}