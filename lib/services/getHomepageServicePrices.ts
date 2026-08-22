import {
    createClient,
  } from "@/lib/supabase/server";
  
  import type {
    HomepageServicePriceOption,
    HomepageServicePriceSummary,
  } from "@/types/homepageServicePrice";
  
  
  interface ServiceOptionRow {
    id:
      string;
  
    option_key:
      string;
  
    title:
      string;
  
    sort_order:
      number;
  }
  
  
  interface ServicePriceRow {
    service_id:
      string;
  
    service_option_id:
      string | null;
  
    amount:
      number | string;
  
    currency:
      string;
  
    service_options:
      ServiceOptionRow |
      ServiceOptionRow[] |
      null;
  }
  
  
  export async function getHomepageServicePrices():
    Promise<
      HomepageServicePriceSummary[]
    > {
    const supabase =
      await createClient();
  
  
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "service_prices"
        )
        .select(`
          service_id,
          service_option_id,
          amount,
          currency,
          service_options (
            id,
            option_key,
            title,
            sort_order
          )
        `)
        .eq(
          "active",
          true
        )
        .eq(
          "currency",
          "MXN"
        );
  
  
    if (error) {
      throw new Error(
        error.message
      );
    }
  
  
    const rows =
      (
        data ??
        []
      ) as
        ServicePriceRow[];
  
  
    const serviceMap =
      new Map<
        string,
        Map<
          string,
          HomepageServicePriceOption
        >
      >();
  
  
    for (
      const row
      of rows
    ) {
      const amount =
        Number(
          row.amount
        );
  
  
      if (
        !Number.isFinite(
          amount
        )
      ) {
        continue;
      }
  
  
      const optionRow =
        Array.isArray(
          row.service_options
        )
          ? (
              row
                .service_options[0] ??
              null
            )
          : row.service_options;
  
  
      const optionKey =
        optionRow
          ?.option_key ??
        null;
  
  
      const uniqueKey =
        row.service_option_id ??
        "__base__";
  
  
      const serviceOptions =
        serviceMap.get(
          row.service_id
        ) ??
        new Map<
          string,
          HomepageServicePriceOption
        >();
  
  
      const existing =
        serviceOptions.get(
          uniqueKey
        );
  
  
      if (
        !existing ||
        amount <
          existing.amount
      ) {
        serviceOptions.set(
          uniqueKey,
          {
            optionKey,
  
            optionTitle:
              optionRow
                ?.title ??
              null,
  
            amount,
  
            currency:
              row.currency,
  
            sortOrder:
              optionRow
                ?.sort_order ??
              0,
          }
        );
      }
  
  
      serviceMap.set(
        row.service_id,
        serviceOptions
      );
    }
  
  
    return Array.from(
      serviceMap.entries()
    ).map(
      ([
        serviceId,
        optionMap,
      ]) => ({
        serviceId,
  
        options:
          Array.from(
            optionMap.values()
          ).sort(
            (
              a,
              b
            ) =>
              a.sortOrder -
              b.sortOrder
          ),
      })
    );
  }