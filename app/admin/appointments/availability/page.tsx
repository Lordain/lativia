import Link from "next/link";

import {
  getAdminAvailabilityWeek,
} from "@/lib/appointments/getAdminAvailabilityWeek";

import {
  getMondayDateKey,
  shiftWeek,
} from "@/lib/appointments/buildAvailabilityWeek";

import AdminAppointmentAvailabilityGrid from "@/components/admin/AdminAppointmentAvailabilityGrid";

import AdminPageHeader from "@/components/admin/AdminPageHeader";


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


  const navigationButtonClass =
    "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950";


  return (
    <div>
      <AdminPageHeader
        title="预约时间管理"
        description="默认全部时段为已占用。只有管理员主动设置为「可预约」的时段，客户才能选择。"
        actions={
          <>
            <Link
              href={`/admin/appointments/availability?week=${previousWeek}`}
              className={
                navigationButtonClass
              }
            >
              ← 上一周
            </Link>

            <Link
              href="/admin/appointments/availability"
              className={
                navigationButtonClass
              }
            >
              本周
            </Link>

            <Link
              href={`/admin/appointments/availability?week=${nextWeek}`}
              className={
                navigationButtonClass
              }
            >
              下一周 →
            </Link>
          </>
        }
      />

      <section className="mt-7 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              当前周
            </p>

            <p className="mt-1 font-bold text-blue-950">
              {
                week.weekStart
              }
              {" → "}
              {
                week.weekEnd
              }
            </p>
          </div>

          <p className="text-sm text-blue-800">
            America/Mexico_City
            （墨西哥城时间）
          </p>
        </div>
      </section>

      <div className="mt-6">
        <AdminAppointmentAvailabilityGrid
          week={
            week
          }
        />
      </div>
    </div>
  );
}