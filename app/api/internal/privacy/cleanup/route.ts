import {
  NextResponse,
} from "next/server";

import {
  cleanupDueOrderData,
} from "@/lib/privacy/cleanupDueOrderData";


export const runtime =
  "nodejs";


export const dynamic =
  "force-dynamic";


async function runCleanup(
  request:
    Request
) {
  /*
   * ========================================
   * Cron authentication
   * ========================================
   */

  const expectedSecret =
    process.env
      .CLEANUP_CRON_SECRET;


  if (
    !expectedSecret
  ) {
    console.error(
      "CLEANUP_CRON_SECRET is not configured"
    );


    return NextResponse.json(
      {
        error:
          "Cleanup service is not configured",
      },
      {
        status:
          500,
      }
    );
  }


  const authorization =
    request.headers.get(
      "authorization"
    );


  if (
    authorization !==
      `Bearer ${expectedSecret}`
  ) {
    return NextResponse.json(
      {
        error:
          "Unauthorized",
      },
      {
        status:
          401,
      }
    );
  }


  /*
   * ========================================
   * Cleanup
   * ========================================
   */

  try {
    const result =
      await cleanupDueOrderData(
        50
      );


    return NextResponse.json({
      ok:
        true,

      ...result,
    });

  } catch (
    error
  ) {
    console.error(
      "Privacy cleanup cron failed:",
      error
    );


    return NextResponse.json(
      {
        ok:
          false,

        error:
          "Cleanup failed",
      },
      {
        status:
          500,
      }
    );
  }
}


export async function GET(
  request:
    Request
) {
  return runCleanup(
    request
  );
}


export async function POST(
  request:
    Request
) {
  return runCleanup(
    request
  );
}