import {
  Payment,
} from "mercadopago";

import {
  mercadoPagoClient,
} from "@/lib/payments/mercadoPago";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  createOrderNotification,
} from "@/lib/notifications/createOrderNotification";

import {
  safeEnsureOrderWorkspace,
} from "@/lib/workspaces/safeEnsureOrderWorkspace";


export interface ProcessMercadoPagoPaymentResult {
  paymentId: string;

  orderId:
    string | null;

  status:
    | "confirmed"
    | "already_processed"
    | "not_approved";
}


export async function processMercadoPagoPayment(
  paymentId: string
): Promise<
  ProcessMercadoPagoPaymentResult
> {
  const cleanPaymentId =
    paymentId.trim();


  if (!cleanPaymentId) {
    throw new Error(
      "MERCADO_PAGO_PAYMENT_ID_REQUIRED"
    );
  }


  /*
   * ========================================
   * 1. Query Mercado Pago
   * ========================================
   */

  const paymentClient =
    new Payment(
      mercadoPagoClient
    );


  const payment =
    await paymentClient.get({
      id:
        cleanPaymentId,
    });


  if (
    payment.id ===
      null ||
    payment.id ===
      undefined
  ) {
    throw new Error(
      "MERCADO_PAGO_PAYMENT_ID_MISSING"
    );
  }


  const providerPaymentId =
    String(
      payment.id
    );


  /*
   * ========================================
   * 2. Minimal Operations Log
   * ========================================
   */

  console.log(
    "Mercado Pago payment retrieved",
    {
      paymentId:
        providerPaymentId,

      status:
        payment.status,

      externalReference:
        payment.external_reference ??
        null,
    }
  );


  /*
   * ========================================
   * 3. Only Approved Payment
   * ========================================
   */

  if (
    payment.status !==
    "approved"
  ) {
    return {
      paymentId:
        providerPaymentId,

      orderId:
        payment.external_reference ??
        null,

      status:
        "not_approved",
    };
  }


  /*
   * ========================================
   * 4. Order Reference
   * ========================================
   */

  const orderId =
    payment.external_reference;


  if (!orderId) {
    throw new Error(
      "MERCADO_PAGO_EXTERNAL_REFERENCE_MISSING"
    );
  }


  /*
   * ========================================
   * 5. Payment Data Integrity
   * ========================================
   */

  if (
    payment.transaction_amount ===
      null ||
    payment.transaction_amount ===
      undefined ||
    !payment.currency_id
  ) {
    throw new Error(
      "MERCADO_PAGO_PAYMENT_DATA_INCOMPLETE"
    );
  }


  const paymentAmount =
    Number(
      payment.transaction_amount
    );


  if (
    !Number.isFinite(
      paymentAmount
    )
  ) {
    throw new Error(
      "MERCADO_PAGO_PAYMENT_AMOUNT_INVALID"
    );
  }


  /*
   * ========================================
   * 6. Supabase Admin
   * ========================================
   */

  const admin =
    createAdminClient();


  /*
   * ========================================
   * 7. Read Order
   * ========================================
   */

  const {
    data:
      order,

    error:
      orderError,
  } =
    await admin
      .from(
        "orders"
      )
      .select(`
        id,
        amount,
        currency,
        payment_status,
        payment_method,
        payment_provider
      `)
      .eq(
        "id",
        orderId
      )
      .single();


  if (
    orderError ||
    !order
  ) {
    console.error(
      "Mercado Pago payment order not found",
      {
        orderId,
      }
    );


    throw new Error(
      "ORDER_NOT_FOUND"
    );
  }


  /*
   * ========================================
   * 8. Provider / Method Validation
   * ========================================
   */

  if (
    order.payment_provider !==
      "mercado_pago" ||
    order.payment_method !==
      "local_payment"
  ) {
    console.error(
      "Mercado Pago payment method mismatch",
      {
        orderId:
          order.id,

        paymentProvider:
          order.payment_provider,

        paymentMethod:
          order.payment_method,
      }
    );


    throw new Error(
      "MERCADO_PAGO_PAYMENT_METHOD_MISMATCH"
    );
  }


  /*
   * ========================================
   * 9. Amount Validation
   * ========================================
   */

  const orderAmount =
    Number(
      order.amount
    );


  if (
    !Number.isFinite(
      orderAmount
    ) ||
    paymentAmount !==
      orderAmount
  ) {
    console.error(
      "Mercado Pago payment amount mismatch",
      {
        orderId:
          order.id,

        providerAmount:
          paymentAmount,

        orderAmount:
          order.amount,
      }
    );


    throw new Error(
      "MERCADO_PAGO_PAYMENT_AMOUNT_MISMATCH"
    );
  }


  /*
   * ========================================
   * 10. Currency Validation
   * ========================================
   */

  if (
    payment.currency_id !==
    order.currency
  ) {
    console.error(
      "Mercado Pago payment currency mismatch",
      {
        orderId:
          order.id,

        providerCurrency:
          payment.currency_id,

        orderCurrency:
          order.currency,
      }
    );


    throw new Error(
      "MERCADO_PAGO_PAYMENT_CURRENCY_MISMATCH"
    );
  }


  /*
   * ========================================
   * 11. Provider Payment Idempotency
   * ========================================
   */

  const {
    data:
      existingTransaction,

    error:
      existingTransactionError,
  } =
    await admin
      .from(
        "payment_transactions"
      )
      .select(`
        id,
        order_id,
        status
      `)
      .eq(
        "provider",
        "mercado_pago"
      )
      .eq(
        "provider_payment_id",
        providerPaymentId
      )
      .maybeSingle();


  if (
    existingTransactionError
  ) {
    console.error(
      "Mercado Pago transaction idempotency check failed"
    );


    throw new Error(
      "PAYMENT_TRANSACTION_CHECK_FAILED"
    );
  }


  if (
    existingTransaction
  ) {
    if (
      existingTransaction
        .order_id !==
      order.id
    ) {
      console.error(
        "Mercado Pago payment order conflict",
        {
          providerPaymentId,

          expectedOrderId:
            order.id,

          existingOrderId:
            existingTransaction
              .order_id,
        }
      );


      throw new Error(
        "MERCADO_PAGO_PAYMENT_ORDER_CONFLICT"
      );
    }


    console.log(
      "Mercado Pago payment already processed",
      {
        paymentId:
          providerPaymentId,

        orderId:
          order.id,
      }
    );


    return {
      paymentId:
        providerPaymentId,

      orderId:
        order.id,

      status:
        "already_processed",
    };
  }


  /*
   * ========================================
   * 12. Atomic Payment Confirmation
   * ========================================
   */

  const {
    error:
      confirmPaymentError,
  } =
    await admin.rpc(
      "confirm_payment_transaction",
      {
        p_order_id:
          order.id,

        p_provider:
          "mercado_pago",

        p_provider_event_id:
          `payment:${providerPaymentId}`,

        p_provider_session_id:
          null,

        p_provider_payment_id:
          providerPaymentId,

        p_amount:
          paymentAmount,

        p_currency:
          payment.currency_id,
      }
    );


  if (
    confirmPaymentError
  ) {
    console.error(
      "Mercado Pago confirm payment failed"
    );


    throw new Error(
      confirmPaymentError
        .message ||
      "CONFIRM_MERCADO_PAGO_PAYMENT_FAILED"
    );
  }


  console.log(
    "Mercado Pago payment confirmed",
    {
      paymentId:
        providerPaymentId,

      orderId:
        order.id,
    }
  );

  await safeEnsureOrderWorkspace(
    order.id
  );


  await createOrderNotification({
    orderId:
      order.id,
  
    type:
      "payment_confirmed",
  
    title:
      "付款已经确认",
  
    message:
      "您的付款已经确认。我们将按照服务要求检查资料，并开始后续办理流程。",
  
    idempotencyKey:
      `payment_confirmed:${order.id}`,
  
    metadata: {
      provider:
        "mercado_pago",
  
      providerPaymentId,
    },
  });

  return {
    paymentId:
      providerPaymentId,

    orderId:
      order.id,

    status:
      "confirmed",
  };
}