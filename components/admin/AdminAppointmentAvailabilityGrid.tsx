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
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Legend */}

      <div className="flex flex-col gap-3 border-b bg-gray-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-semibold">
            周预约时间表
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            点击时段即可切换状态。
            默认全部为已占用。
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500" />

            <span>
              可预约
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gray-300" />

            <span>
              已占用
            </span>
          </div>
        </div>
      </div>


      {/* Desktop Grid */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr>
              <th className="w-24 border-b border-r bg-gray-50 px-3 py-4 text-left text-sm font-medium text-gray-500">
                时间
              </th>

              {week.days.map(
                day => (
                  <th
                    key={
                      day.date
                    }
                    className="border-b border-r bg-gray-50 px-3 py-4 text-center last:border-r-0"
                  >
                    <p className="font-semibold">
                      {
                        day.weekdayLabel
                      }
                    </p>

                    <p className="mt-1 text-xs font-normal text-gray-500">
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
                  <td className="border-b border-r bg-gray-50 px-3 py-3 text-sm font-medium text-gray-600">
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
                            className="border-b border-r p-2 last:border-r-0"
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
                          className="border-b border-r p-2 last:border-r-0"
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
                              rounded-lg
                              border
                              px-2
                              py-2
                              text-sm
                              font-medium
                              transition
                              disabled:cursor-not-allowed
                              disabled:opacity-70

                              ${
                                slot.isAvailable
                                  ? "border-green-300 bg-green-50 text-green-800 hover:bg-green-100"
                                  : "border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200"
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


      {/* Mobile */}

      <div className="space-y-6 p-4 md:hidden">
        {week.days.map(
          day => (
            <div
              key={
                day.date
              }
            >
              <div className="mb-3">
                <p className="font-semibold">
                  {
                    day.weekdayLabel
                  }
                </p>

                <p className="text-xs text-gray-500">
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
                          rounded-lg
                          border
                          px-2
                          py-3
                          text-sm
                          font-medium

                          ${
                            slot.isAvailable
                              ? "border-green-300 bg-green-50 text-green-800"
                              : "border-gray-200 bg-gray-100 text-gray-500"
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

                        <span className="mt-1 block text-xs">
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
            </div>
          )
        )}
      </div>
    </div>
  );
}