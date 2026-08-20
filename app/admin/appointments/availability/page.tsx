import Link from "next/link";

import {
  getAdminAvailabilityWeek,
} from "@/lib/appointments/getAdminAvailabilityWeek";

import {
  getMondayDateKey,
  shiftWeek,
} from "@/lib/appointments/buildAvailabilityWeek";

import AdminAppointmentAvailabilityGrid from "@/components/admin/AdminAppointmentAvailabilityGrid";


interface Props {
  searchParams:
    Promise<{
      week?: string;
    }>;
}


export default async function AdminAppointmentAvailabilityPage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const requestedWeek =
    params.week;

  const weekStart =
    requestedWeek &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      requestedWeek
    )
      ? getMondayDateKey(
          requestedWeek
        )
      : getMondayDateKey();

  const week =
    await getAdminAvailabilityWeek(
      weekStart
    );

  const previousWeek =
    shiftWeek(
      weekStart,
      -1
    );

  const nextWeek =
    shiftWeek(
      weekStart,
      1
    );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Appointment Availability
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            预约时间管理
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
            默认全部时段为已占用。
            只有 Admin 主动设置为
            「可预约」的时段，
            客户才能选择。
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/appointments/availability?week=${previousWeek}`}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            ← 上一周
          </Link>

          <Link
            href="/admin/appointments/availability"
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            本周
          </Link>

          <Link
            href={`/admin/appointments/availability?week=${nextWeek}`}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            下一周 →
          </Link>
        </div>
      </div>


      <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
        <strong>
          当前周：
        </strong>
        {" "}
        {
          week.weekStart
        }
        {" → "}
        {
          week.weekEnd
        }

        <br />

        时间统一按
        America/Mexico_City
        （墨西哥城）显示。
      </div>


      <AdminAppointmentAvailabilityGrid
        week={
          week
        }
      />
    </div>
  );
}