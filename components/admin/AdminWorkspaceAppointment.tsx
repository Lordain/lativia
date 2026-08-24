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
    <div>
      <div>
        <h4 className="font-bold text-slate-950">
          咨询预约与线上会议
        </h4>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          客户根据预约规则自行选择可用时间；
          预约确认后可在这里配置线上会议入口。
        </p>
      </div>

      {data.rule ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">
                当前预约规则
              </p>

              <p className="mt-1 text-sm text-slate-500">
                时区：
                {
                  data.rule.timezone
                }
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              已启用
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-medium text-slate-500">
                营业日
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                周一～周六
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-medium text-slate-500">
                营业时间
              </p>

              <p className="mt-1 font-semibold text-slate-900">
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

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-medium text-slate-500">
                预约时长
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {
                  data.rule.slotMinutes
                } 分钟
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-medium text-slate-500">
                开放范围
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                未来{" "}
                {
                  data.rule.bookingWindowDays
                }{" "}
                天
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            最少提前{" "}
            {
              data.rule.minimumNoticeHours
            }{" "}
            小时预约。
            不可预约的时间统一向客户显示为「已占用」。
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-800">
            当前没有启用的预约规则
          </p>
        </div>
      )}

      {!data.appointment && (
        <div className="mt-5 rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-5">
          <p className="font-semibold text-blue-950">
            等待客户预约
          </p>

          <p className="mt-2 text-sm leading-6 text-blue-700">
            客户可以在订单服务空间中查看当前可预约时段并选择咨询时间。
          </p>
        </div>
      )}

      {data.appointment &&
        data.appointment
          .startsAt &&
        data.appointment
          .endsAt && (
        <>
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  当前预约已确认
                </p>

                <p className="mt-2 text-lg font-bold text-emerald-950">
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

                <p className="mt-1 text-xs text-emerald-700">
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
                className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                取消预约
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-950">
                  线上会议
                </h4>

                <p className="mt-1 text-sm text-slate-500">
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
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {
                    getProviderLabel(
                      data.appointment
                        .meetingProvider
                    )
                  }
                </span>
              )}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className="font-semibold text-slate-700">
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
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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
                <span className="font-semibold text-slate-700">
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
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  placeholder="例如：Cetesdirecto 首次开户咨询"
                />
              </label>
            </div>

            <label className="mt-4 block text-sm">
              <span className="font-semibold text-slate-700">
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
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                placeholder="https://..."
              />
            </label>

            <label className="mt-4 block text-sm">
              <span className="font-semibold text-slate-700">
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
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
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
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {success}
        </p>
      )}
    </div>
  );
}
