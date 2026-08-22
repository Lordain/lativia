import {
    getOfficialReferenceRates,
  } from "@/lib/cetes/getOfficialReferenceRates";
  
  import {
    getCetesReferenceRates,
  } from "@/lib/cetes/getCetesReferenceRates";
  
  import type {
    CetesReferenceRate,
  } from "@/types/cetes";
  
  import type {
    GovernmentBondRate,
    GovernmentBondRateSnapshot,
  } from "@/types/governmentBondRates";
  
  
  function buildFallbackRates(
    rates:
      CetesReferenceRate[]
  ):
    GovernmentBondRate[] {
    return rates.map(
      item => {
        let term =
          `${item.termDays} 天`;
  
  
        if (
          item.instrumentCode ===
            "CETES" &&
          item.termDays ===
            364
        ) {
          term =
            "1 年";
        }
  
  
        if (
          item.instrumentCode ===
          "BONOS"
        ) {
          term =
            item.termDays ===
            1095
              ? "3 年"
              : `${item.termDays} 天`;
        }
  
  
        if (
          item.instrumentCode ===
          "BONDDIA"
        ) {
          term =
            "1 日";
        }
  
  
        return {
          id:
            item.id,
  
          product:
            item.instrumentCode,
  
          term,
  
          rate:
            item.rate,
        };
      }
    );
  }
  
  
  export async function getGovernmentBondRateSnapshot(
    fallbackRates?:
      CetesReferenceRate[]
  ):
    Promise<
      GovernmentBondRateSnapshot
    > {
    const officialSnapshot =
      await getOfficialReferenceRates();
  
  
    if (
      officialSnapshot
        ?.rates.length
    ) {
      return officialSnapshot;
    }
  
  
    const databaseRates =
      fallbackRates ??
      await getCetesReferenceRates();
  
  
    return {
      sourceName:
        databaseRates[0]
          ?.sourceName ??
        "官方参考数据",
  
      sourceDate:
        databaseRates[0]
          ?.sourceDate ??
        null,
  
      rates:
        buildFallbackRates(
          databaseRates
        ),
    };
  }