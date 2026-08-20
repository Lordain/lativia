import {
  createClient,
} from "@/lib/supabase/server";

import type {
  Currency,
  PaymentMethod,
  PaymentProvider,
} from "@/types/payment";

import type {
  ServiceMode,
  ServiceOptionSummary,
  ServicePrice,
} from "@/types/servicePrice";


interface ServiceOptionRow {
  id:
    string;

  option_key:
    string;

  title:
    string;

  description:
    string | null;

  service_mode:
    string;

  onsite_available:
    boolean;

  allowed_regions:
    unknown;

  requires_document_review:
    boolean;

  workspace_required:
    boolean;

  active:
    boolean;

  sort_order:
    number;
}


export async function getServicePrices(
  serviceId: string
): Promise<
  ServicePrice[]
> {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from(
      "service_prices"
    )
    .select(`
      id,
      service_id,
      service_option_id,
      currency,
      amount,
      payment_method,
      payment_provider,
      active,

        service_options (
          id,
          option_key,
          title,
          description,
          service_mode,
          onsite_available,
          allowed_regions,
          requires_document_review,
          workspace_required,
          active,
          sort_order
        )
    `)
    .eq(
      "service_id",
      serviceId
    )
    .eq(
      "active",
      true
    )
    .order(
      "currency"
    );

  if (error) {
    throw new Error(
      error.message
    );
  }


  return (
    data ?? []
  ).map(
    (price) => {
      const optionRow =
        Array.isArray(
          price.service_options
        )
          ? (
              price.service_options[0] ??
              null
            )
          : (
              price.service_options ??
              null
            );


      let serviceOption:
        ServiceOptionSummary | null =
        null;


      if (
        optionRow
      ) {
        const option =
          optionRow as
            ServiceOptionRow;


        const allowedRegions =
          Array.isArray(
            option.allowed_regions
          )
            ? option
                .allowed_regions
                .filter(
                  (
                    region
                  ): region is string =>
                    typeof region ===
                    "string"
                )
            : [];


        serviceOption = {
          id:
            option.id,

          optionKey:
            option.option_key,

          title:
            option.title,

          description:
            option.description,

          serviceMode:
            option.service_mode as
              ServiceMode,

          onsiteAvailable:
            Boolean(
              option.onsite_available
            ),

          allowedRegions,

          requiresDocumentReview:
            Boolean(
              option.requires_document_review
            ),

          workspaceRequired:
            Boolean(
              option
                .workspace_required
            ),

          active:
            Boolean(
              option.active
            ),

          sortOrder:
            Number(
              option.sort_order
            ),
        };
      }


      return {
        id:
          price.id,

        serviceId:
          price.service_id,

        serviceOptionId:
          price.service_option_id,

        serviceOption,

        currency:
          price.currency as
            Currency,

        amount:
          Number(
            price.amount
          ),

        paymentMethod:
          price.payment_method as
            PaymentMethod,

        paymentProvider:
          price.payment_provider as
            PaymentProvider,

        active:
          Boolean(
            price.active
          ),
      };
    }
  );
}