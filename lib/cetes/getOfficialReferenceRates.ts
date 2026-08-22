import type {
    GovernmentBondRateSnapshot,
  } from "@/types/governmentBondRates";
  
  
  const OFFICIAL_RATES_URL =
    "https://www.cetesdirecto.com/sites/portal/historia.cetesdirecto";
  
  
  function normalizeOfficialText(
    html: string
  ) {
    return html
      .replace(
        /<script[\s\S]*?<\/script>/gi,
        " "
      )
      .replace(
        /<style[\s\S]*?<\/style>/gi,
        " "
      )
      .replace(
        /&nbsp;/gi,
        " "
      )
      .replace(
        /&aacute;/gi,
        "á"
      )
      .replace(
        /&eacute;/gi,
        "é"
      )
      .replace(
        /&iacute;/gi,
        "í"
      )
      .replace(
        /&oacute;/gi,
        "ó"
      )
      .replace(
        /&uacute;/gi,
        "ú"
      )
      .replace(
        /&ntilde;/gi,
        "ñ"
      )
      .replace(
        /<[^>]+>/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();
  }
  
  
  function extractRate(
    text: string,
    pattern: RegExp
  ) {
    const match =
      text.match(
        pattern
      );
  
    if (
      !match?.[1]
    ) {
      return null;
    }
  
    const value =
      Number(
        match[1]
      );
  
    return Number.isFinite(
      value
    )
      ? value
      : null;
  }
  
  
  function normalizeOfficialDate(
    value:
      string | null
  ) {
    if (!value) {
      return null;
    }
  
    const match =
      value.match(
        /^(\d{1,2})-([a-záéíóú]+)-(\d{4})$/i
      );
  
    if (!match) {
      return value;
    }
  
    const [
      ,
      day,
      rawMonth,
      year,
    ] = match;
  
    const monthMap:
      Record<string, string> = {
        ene: "01",
        feb: "02",
        mar: "03",
        abr: "04",
        may: "05",
        jun: "06",
        jul: "07",
        ago: "08",
        sep: "09",
        oct: "10",
        nov: "11",
        dic: "12",
    };
  
    const month =
      monthMap[
        rawMonth
          .toLowerCase()
      ];
  
    if (!month) {
      return value;
    }
  
    return `${year}-${month}-${day.padStart(
      2,
      "0"
    )}`;
  }
  
  
  export async function getOfficialReferenceRates():
    Promise<
      GovernmentBondRateSnapshot | null
    > {
    try {
      const response =
        await fetch(
          OFFICIAL_RATES_URL,
          {
            next: {
              revalidate:
                60 * 60,
            },
          }
        );
  
      if (
        !response.ok
      ) {
        return null;
      }
  
  
      const html =
        await response.text();
  
      const text =
        normalizeOfficialText(
          html
        );
  
  
      const dateMatch =
        text.match(
          /(\d{1,2}-[a-záéíóú]{3}-\d{4})/i
        );
  
  
      const definitions = [
        {
          id:
            "cetes-1m",
  
          product:
            "CETES" as const,
  
          term:
            "1 个月",
  
          pattern:
            /CETES\s+1\s+mes:\s*\+?0?(\d+(?:\.\d+)?)%/i,
        },
  
        {
          id:
            "cetes-3m",
  
          product:
            "CETES" as const,
  
          term:
            "3 个月",
  
          pattern:
            /CETES\s+3\s+mes(?:es)?:\s*\+?0?(\d+(?:\.\d+)?)%/i,
        },
  
        {
          id:
            "cetes-6m",
  
          product:
            "CETES" as const,
  
          term:
            "6 个月",
  
          pattern:
            /CETES\s+6\s+mes(?:es)?:\s*\+?0?(\d+(?:\.\d+)?)%/i,
        },
  
        {
          id:
            "cetes-1y",
  
          product:
            "CETES" as const,
  
          term:
            "1 年",
  
          pattern:
            /CETES\s+1\s+año:\s*\+?0?(\d+(?:\.\d+)?)%/i,
        },
  
        {
          id:
            "bonos-3y",
  
          product:
            "BONOS" as const,
  
          term:
            "3 年",
  
          pattern:
            /BONOS\s+3\s+años:\s*\+?0?(\d+(?:\.\d+)?)%/i,
        },
  
        {
          id:
            "bonddia-1d",
  
          product:
            "BONDDIA" as const,
  
          term:
            "1 日",
  
          pattern:
            /BONDDIA\s+1\s+día:\s*\+?0?(\d+(?:\.\d+)?)%/i,
        },
      ];
  
  
      const officialRates =
        definitions.flatMap(
          definition => {
            const rate =
              extractRate(
                text,
                definition.pattern
              );
  
            if (
              rate === null
            ) {
              return [];
            }
  
            return [
              {
                id:
                  definition.id,
  
                product:
                  definition.product,
  
                term:
                  definition.term,
  
                rate,
              },
            ];
          }
        );
  
  
      if (
        officialRates.length ===
        0
      ) {
        return null;
      }
  
  
      return {
        sourceName:
          "Cetesdirecto",
  
        sourceDate:
          normalizeOfficialDate(
            dateMatch?.[1] ??
              null
          ),
  
        rates:
          officialRates,
      };
    } catch (
      error
    ) {
      console.error(
        "getOfficialReferenceRates error:",
        error
      );
  
      return null;
    }
  }