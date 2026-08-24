"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  setAppointmentSlotAvailability,
} from "@/lib/appointments/setAppointmentSlotAvailability";

import type {
  AppointmentAvailabilityWeek,
} from "@/types/appointmentAvailability";


interface Props {
  week:
    AppointmentAvailabilityWeek;
}


function formatHour(
  iso:
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

      hour12:
        false,
    }
  ).format(
    new Date(
      iso
    )
  );
}


export default function AdminAppointmentAvailabilityGrid({
  week,
}: Props) {
  const router =
    useRouter();

  const [
    pendingSlot,
    setPendingSlot,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    isPending,
    startTransition,
  ] =
    useTransition();


  function toggleSlot(
    startAt:
      string,

    endAt:
      string,

    current:
      boolean
  ) {
    setPendingSlot(
      startAt
    );

    startTransition(
      async () => {
        try {
          await setAppointmentSlotAvailability(
            {
              startAt,

              endAt,

              isAvailable:
                !current,
            }
          );

          router.refresh();
        } catch (
          error
        ) {
          console.error(
            error
          );

          alert(
            error instanceof Error
              ? error.message
              : "更新预约时间失败"
          );
        } finally {
          setPendingSlot(
            null
          );
        }
      }
    );
  }


  const firstDay =
    week.days[0];

  const hours =
    firstDay?.slots ??
    [];


    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/80 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              周预约时间表
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              点击未被客户预约的时段即可切换开放状态。
              已存在预约的时段不可覆盖。
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
  <div className="flex items-center gap-2">
    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

    <span>
      可预约
    </span>
  </div>

  <div className="flex items-center gap-2">
    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />

    <span>
      已占用
    </span>
  </div>
</div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr>
                <th className="w-24 border-b border-r border-slate-200 bg-slate-50 px-3 py-4 text-left text-sm font-semibold text-slate-500">
                  时间
                </th>

                {week.days.map(
                  day => (
                    <th
                      key={
                        day.date
                      }
                      className="border-b border-r border-slate-200 bg-slate-50 px-3 py-4 text-center last:border-r-0"
                    >
                      <p className="font-bold text-slate-900">
                        {
                          day.weekdayLabel
                        }
                      </p>

                      <p className="mt-1 text-xs font-normal text-slate-500">
                        {
                          day.dateLabel
                        }
                      </p>
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {hours.map(
                (
                  hourSlot,
                  hourIndex
                ) => (
                  <tr
                    key={
                      hourSlot.startAt
                    }
                  >
                    <td className="border-b border-r border-slate-200 bg-slate-50/70 px-3 py-3 text-sm font-semibold text-slate-600">
                      {
                        formatHour(
                          hourSlot.startAt
                        )
                      }
                    </td>

                    {week.days.map(
                      day => {
                        const slot =
                          day.slots[
                            hourIndex
                          ];


                        if (!slot) {
                          return (
                            <td
                              key={
                                day.date
                              }
                              className="border-b border-r border-slate-100 p-2 last:border-r-0"
                            />
                          );
                        }


                        const loading =
                          isPending &&
                          pendingSlot ===
                            slot.startAt;


                        return (
                          <td
                            key={
                              slot.startAt
                            }
                            className="border-b border-r border-slate-100 p-2 last:border-r-0"
                          >
                            <button
                              type="button"
                              disabled={
                                loading ||
                                slot.isBooked
                              }
                              onClick={() =>
                                toggleSlot(
                                  slot.startAt,
                                  slot.endAt,
                                  slot.isAvailable
                                )
                              }
                              className={`
                                min-h-12
                                w-full
                                rounded-xl
                                border
                                px-2
                                py-2
                                text-sm
                                font-semibold
                                transition
                                disabled:cursor-not-allowed
                                ${
                                  slot.isAvailable
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300 hover:bg-emerald-100"
                                    : "border-slate-200 bg-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-200"
                                }
                              `}
                            >
                            {loading
                              ? "更新中…"
                              : slot.isAvailable
                                ? "可预约"
                                : "已占用"}
                            </button>
                          </td>
                        );
                      }
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-7 p-4 md:hidden">
          {week.days.map(
            day => (
              <section
                key={
                  day.date
                }
              >
                <div className="mb-3">
                  <p className="font-bold text-slate-900">
                    {
                      day.weekdayLabel
                    }
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {
                      day.dateLabel
                    }
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {day.slots.map(
                    slot => {
                      const loading =
                        isPending &&
                        pendingSlot ===
                          slot.startAt;


                      return (
                        <button
                          key={
                            slot.startAt
                          }
                          type="button"
                          disabled={
                            loading ||
                            slot.isBooked
                          }
                          onClick={() =>
                            toggleSlot(
                              slot.startAt,
                              slot.endAt,
                              slot.isAvailable
                            )
                          }
                          className={`
                            rounded-xl
                            border
                            px-2
                            py-3
                            text-sm
                            font-semibold
                            transition
                            disabled:cursor-not-allowed
                            ${
                              slot.isAvailable
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-slate-200 bg-slate-100 text-slate-500"
                            }
                          `}
                        >
                          <span className="block">
                            {
                              formatHour(
                                slot.startAt
                              )
                            }
                          </span>

                          <span className="mt-1 block text-xs font-medium">
                          {loading
                          ? "更新中…"
                          : slot.isAvailable
                            ? "可预约"
                            : "已占用"}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </section>
            )
          )}
        </div>
      </div>
    );
}
