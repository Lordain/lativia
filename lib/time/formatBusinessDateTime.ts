import {
    BUSINESS_TIME_ZONE,
  } from "@/lib/time/businessTime";
  
  export function formatBusinessDateTime(
    value: string | Date
  ) {
    const date =
      value instanceof Date
        ? value
        : new Date(value);
  
    return new Intl.DateTimeFormat(
      "zh-CN",
      {
        timeZone:
          BUSINESS_TIME_ZONE,
  
        year:
          "numeric",
  
        month:
          "2-digit",
  
        day:
          "2-digit",
  
        hour:
          "2-digit",
  
        minute:
          "2-digit",
  
        second:
          "2-digit",
  
        hourCycle:
          "h23",
      }
    ).format(date);
  }