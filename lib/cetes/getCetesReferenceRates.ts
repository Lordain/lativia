import {
    supabase,
  } from "@/lib/supabase";
  
  import type {
    CetesReferenceRate,
  } from "@/types/cetes";
  
  interface CetesReferenceRateRow {
    id: string;
  
    term_days:
      number;
  
    rate:
      number | string;
  
    source_date:
      string;
  
    source_name:
      string;
  
    source_url:
      string | null;
  
    updated_at:
      string | null;
  }
  
  export async function getCetesReferenceRates():
    Promise<
      CetesReferenceRate[]
    > {
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "cetes_reference_rates"
        )
        .select(`
          id,
          term_days,
          rate,
          source_date,
          source_name,
          source_url,
          updated_at
        `)
        .order(
          "term_days",
          {
            ascending:
              true,
          }
        );
  
    if (error) {
      console.error(
        "getCetesReferenceRates error:",
        error
      );
  
      /*
       * 收益率展示失败不能让整个
       * Service Page 404。
       */
  
      return [];
    }
  
    return (
      data ?? []
    ).map(
      row => {
        const item =
          row as
            CetesReferenceRateRow;
  
        return {
          id:
            item.id,
  
          termDays:
            item.term_days as
              | 28
              | 91
              | 182
              | 364,
  
          rate:
            Number(
              item.rate
            ),
  
          sourceDate:
            item.source_date,
  
          sourceName:
            item.source_name,
  
          sourceUrl:
            item.source_url,
  
          updatedAt:
            item.updated_at,
        };
      }
    );
  }