"use client";

import {
  useMemo,
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  AvailableAppointmentSlot,
  OrderAppointmentData,
} from "@/types/appointment";

import {
  bookMyWorkspaceAppointment,
} from "@/lib/appointments/bookMyWorkspaceAppointment";


interface Props {
  workspaceId:
    string;

  data:
    OrderAppointmentData;

}


function formatDateLabel(
  value:
    string
) {
  return new Intl.DateTimeFormat(
    "zh-CN",
    {
      timeZone:
        "America/Mexico_City",

      month:
        "numeric",

      day:
        "numeric",

      weekday:
        "short",
    }
  ).format(
    new Date(
      value
    )
  );
}


function formatFullAppointmentDate(
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


function getMexicoCityDateKey(
  value:
    string
) {
  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "America/Mexico_City",

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",
      }
    ).formatToParts(
      new Date(
        value
      )
    );


  const get =
    (
      type:
        Intl.DateTimeFormatPartTypes
    ) =>
      parts.find(
        part =>
          part.type ===
          type
      )?.value ??
      "";


  return `${get(
    "year"
  )}-${get(
    "month"
  )}-${get(
    "day"
  )}`;
}


export default function CustomerWorkspaceAppointment({
  workspaceId,
  data,
}: Props) {
  const router =
    useRouter();


  const [
    pending,
    startTransition,
  ] =
    useTransition();


  const [
    selectedStartsAt,
    setSelectedStartsAt,
  ] =
    useState<
      string | null
    >(
      null
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


  /*
   * =========================================
   * Group available slots by local date
   * =========================================
   */

  const slotGroups =
    useMemo(
      () => {
        const groups =
          new Map<
            string,
            AvailableAppointmentSlot[]
          >();


        for (
          const slot of
          data.slots
        ) {
          const key =
            getMexicoCityDateKey(
              slot.startsAt
            );


          const current =
            groups.get(
              key
            ) ??
            [];


          current.push(
            slot
          );


          groups.set(
            key,
            current
          );
        }


        return Array.from(
          groups.entries()
        );
      },
      [
        data.slots,
      ]
    );


  function handleBook(
    startsAt:
      string
  ) {
    setError(
      null
    );

    setSelectedStartsAt(
      startsAt
    );


    startTransition(
      async () => {
        try {
          await bookMyWorkspaceAppointment(
            workspaceId,
            startsAt
          );


          router.refresh();

        } catch (
          caught
        ) {
          setError(
            caught instanceof Error
              ? caught.message
              : "预约失败"
          );

        } finally {
          setSelectedStartsAt(
            null
          );
        }
      }
    );
  }


  /*
   * =========================================
   * Confirmed Appointment
   * =========================================
   */

  if (
    data.appointment &&
    data.appointment
      .startsAt &&
    data.appointment
      .endsAt
  ) {
    return (
      <section className="rounded-xl border bg-white p-4 md:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Appointment
          </p>

          <h3 className="mt-1 text-lg font-semibold">
            预约咨询
          </h3>
        </div>


        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="font-semibold text-green-800">
            预约成功
          </p>

          <p className="mt-2 text-base font-semibold text-green-950 md:text-lg">
            {
              formatFullAppointmentDate(
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

          <p className="mt-1 text-sm text-green-700">
            墨西哥城时间
          </p>


          {data.appointment
            .meetingTitle && (
            <p className="mt-3 text-sm font-medium text-green-950">
              {
                data.appointment
                  .meetingTitle
              }
            </p>
          )}
        </div>


        <div className="mt-4 rounded-xl border p-4">
          <h4 className="font-semibold">
            线上会议
          </h4>


          {data.appointment
            .meetingStatus ===
              "ready" &&
          data.appointment
            .meetingUrl ? (
            <>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                服务团队已经准备好线上会议入口。
                请在预约时间进入会议。
              </p>

              <a
                href={
                  data.appointment
                    .meetingUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                进入线上会议
              </a>


              {data.appointment
                .meetingNotes && (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-500">
                  {
                    data.appointment
                      .meetingNotes
                  }
                </p>
              )}
            </>
          ) : (
            <div className="mt-3 rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-700">
                会议链接准备中
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                服务团队将在咨询开始前提供线上会议入口。
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm leading-6 text-gray-500">
          如需调整预约时间，
          请通过本订单的「服务沟通」联系服务人员。
        </p>
      </section>
    );
  }


  /*
   * =========================================
   * Compact Booking Calendar
   * =========================================
   */

  return (
    <section className="rounded-xl border bg-white p-4 md:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Appointment Calendar
        </p>

        <div className="mt-1 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              选择咨询时间
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              未来两周可预约时间，均为墨西哥城时间。
            </p>
          </div>


          {data.rule && (
            <div className="flex flex-wrap gap-1.5 text-[11px] text-gray-600">
              <span className="rounded-full bg-gray-100 px-2.5 py-1">
                周一～周六
              </span>

              <span className="rounded-full bg-gray-100 px-2.5 py-1">
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
              </span>

              <span className="rounded-full bg-gray-100 px-2.5 py-1">
                {
                  data.rule.slotMinutes
                } 分钟
              </span>

              <span className="rounded-full bg-gray-100 px-2.5 py-1">
                提前 {
                  data.rule.minimumNoticeHours
                }h
              </span>
            </div>
          )}
        </div>
      </div>


      {slotGroups.length ===
      0 ? (
        <div className="mt-4 rounded-xl bg-gray-50 p-4">
          <p className="font-medium text-gray-700">
            目前没有可预约时间
          </p>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            请稍后再查看，
            或通过「服务沟通」联系服务人员。
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y">
          {slotGroups.map(
            ([
              dateKey,
              slots,
            ]) => (
              <div
                key={
                  dateKey
                }
                className="py-3 first:pt-0 last:pb-0"
              >
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                  {/* Date */}

                  <div className="flex shrink-0 items-center justify-between lg:w-32">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {
                        formatDateLabel(
                          slots[0]
                            .startsAt
                        )
                      }
                    </h4>

                    <span className="text-[11px] text-gray-400 lg:hidden">
                      {
                        slots.length
                      } 个
                    </span>
                  </div>


                  {/* Times */}

                  <div className="min-w-0 flex-1 overflow-x-auto">
                    <div className="flex min-w-max gap-1.5 pb-1">
                      {slots.map(
                        slot => {
                          const loading =
                            pending &&
                            selectedStartsAt ===
                              slot.startsAt;


                          return (
                            <button
                              key={
                                slot.id
                              }
                              type="button"
                              disabled={
                                pending
                              }
                              onClick={() =>
                                handleBook(
                                  slot.startsAt
                                )
                              }
                              className="
                                min-w-[68px]
                                rounded-md
                                border
                                border-gray-300
                                bg-white
                                px-2.5
                                py-2
                                text-xs
                                font-medium
                                text-gray-800
                                transition
                                hover:border-blue-500
                                hover:bg-blue-50
                                hover:text-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >
                              {
                                loading
                                  ? "..."
                                  : formatTime(
                                      slot.startsAt
                                    )
                              }
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>


                  <span className="hidden shrink-0 text-[11px] text-gray-400 lg:block">
                    {
                      slots.length
                    } 个
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}


      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}