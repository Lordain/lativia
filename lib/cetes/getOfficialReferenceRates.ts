import type {
  GovernmentBondRateSnapshot,
} from "@/types/governmentBondRates";


const CETES_URL =
  "https://www.cetesdirecto.com/tablas/valores_gubernamentales/cetes.html";

const BONOS_URL =
  "https://www.cetesdirecto.com/tablas/valores_gubernamentales/bonos.html";

const BONDDIA_URL =
  "https://www.cetesdirecto.com/tablas/valores_gubernamentales/bonddia.html";


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
      /&#225;/gi,
      "á"
    )
    .replace(
      /&#233;/gi,
      "é"
    )
    .replace(
      /&#237;/gi,
      "í"
    )
    .replace(
      /&#243;/gi,
      "ó"
    )
    .replace(
      /&#250;/gi,
      "ú"
    )
    .replace(
      /&#241;/gi,
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


  if (!match?.[1]) {
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
      /^(\d{1,2})\s+([a-záéíóúñ]+)\s+(\d{4})$/i
    );


  if (!match) {
    return value;
  }


  const [
    ,
    day,
    rawMonth,
    year,
  ] =
    match;


  const monthKey =
    rawMonth
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );


  const monthMap:
    Record<string, string> = {
      enero:
        "01",

      febrero:
        "02",

      marzo:
        "03",

      abril:
        "04",

      mayo:
        "05",

      junio:
        "06",

      julio:
        "07",

      agosto:
        "08",

      septiembre:
        "09",

      octubre:
        "10",

      noviembre:
        "11",

      diciembre:
        "12",
    };


  const month =
    monthMap[
      monthKey
    ];


  if (!month) {
    return value;
  }


  return `${year}-${month}-${day.padStart(
    2,
    "0"
  )}`;
}


async function fetchOfficialTable(
  url: string
) {
  const response =
    await fetch(
      url,
      {
        next: {
          revalidate:
            60 * 60,
        },
      }
    );


  if (!response.ok) {
    throw new Error(
      `OFFICIAL_RATE_FETCH_FAILED_${response.status}`
    );
  }


  return normalizeOfficialText(
    await response.text()
  );
}


export async function getOfficialReferenceRates():
  Promise<
    GovernmentBondRateSnapshot | null
  > {
  try {
    const [
      cetesText,
      bonosText,
      bonddiaText,
    ] =
      await Promise.all([
        fetchOfficialTable(
          CETES_URL
        ),

        fetchOfficialTable(
          BONOS_URL
        ),

        fetchOfficialTable(
          BONDDIA_URL
        ),
      ]);


    const cetes1m =
      extractRate(
        cetesText,
        /1\s+mes\s+\d+(?:\.\d+)?\s+(\d+(?:\.\d+)?)/i
      );


    const cetes3m =
      extractRate(
        cetesText,
        /3\s+meses\s+\d+(?:\.\d+)?\s+(\d+(?:\.\d+)?)/i
      );


    const cetes6m =
      extractRate(
        cetesText,
        /6\s+meses\s+\d+(?:\.\d+)?\s+(\d+(?:\.\d+)?)/i
      );


    const cetes1y =
      extractRate(
        cetesText,
        /1\s+año\s+\d+(?:\.\d+)?\s+(\d+(?:\.\d+)?)/i
      );


    const bonos3y =
      extractRate(
        bonosText,
        /3\s+años\s+\d+(?:\.\d+)?\s+(\d+(?:\.\d+)?)/i
      );


    const bonddiaDaily =
      extractRate(
        bonddiaText,
        /Rendimiento\s+diario\s+(\d+(?:\.\d+)?)\s*\*?/i
      );


    if (
      cetes1m === null ||
      cetes3m === null ||
      cetes6m === null ||
      cetes1y === null ||
      bonos3y === null ||
      bonddiaDaily === null
    ) {
      console.error(
        "getOfficialReferenceRates incomplete official table data:",
        {
          cetes1m,
          cetes3m,
          cetes6m,
          cetes1y,
          bonos3y,
          bonddiaDaily,
        }
      );


      return null;
    }


    const dateMatch =
      cetesText.match(
        /CETES\s+(\d{1,2}\s+[a-záéíóúñ]+\s+\d{4})/i
      );


    return {
      sourceName:
        "Cetesdirecto",

      sourceDate:
        normalizeOfficialDate(
          dateMatch?.[1] ??
            null
        ),

      rates: [
        {
          id:
            "cetes-1m",

          product:
            "CETES",

          term:
            "1 个月",

          rate:
            cetes1m,
        },

        {
          id:
            "cetes-3m",

          product:
            "CETES",

          term:
            "3 个月",

          rate:
            cetes3m,
        },

        {
          id:
            "cetes-6m",

          product:
            "CETES",

          term:
            "6 个月",

          rate:
            cetes6m,
        },

        {
          id:
            "cetes-1y",

          product:
            "CETES",

          term:
            "1 年",

          rate:
            cetes1y,
        },

        {
          id:
            "bonos-3y",

          product:
            "BONOS",

          term:
            "3 年",

          rate:
            bonos3y,
        },

        {
          id:
            "bonddia-1d",

          product:
            "BONDDIA",

          term:
            "1 日",

          rate:
            bonddiaDaily,
        },
      ],
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