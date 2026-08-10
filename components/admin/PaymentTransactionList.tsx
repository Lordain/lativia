interface Transaction {
    id: string;
  
    provider: string;
  
    provider_event_id:
      | string
      | null;
  
    provider_session_id:
      | string
      | null;
  
    provider_payment_id:
      | string
      | null;
  
    amount: number | string;
  
    currency: string;
  
    status: string;
  
    created_at: string;
  }
  
  interface Props {
    transactions: Transaction[];
  }
  
  export default function PaymentTransactionList({
    transactions,
  }: Props) {
    if (transactions.length === 0) {
      return (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            支付交易紀錄
          </h2>
  
          <p className="mt-4 text-sm text-gray-500">
            目前沒有支付交易紀錄。
          </p>
        </section>
      );
    }
  
    return (
      <section className="mt-8">
        <h2 className="text-xl font-semibold">
          支付交易紀錄
        </h2>
  
        <div className="mt-4 space-y-4">
          {transactions.map(
            (transaction) => (
              <div
                key={transaction.id}
                className="rounded-xl border p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold">
                    {transaction.provider}
                  </p>
  
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    {transaction.status}
                  </span>
                </div>
  
                <p className="mt-4 text-xl font-semibold">
                  {transaction.currency ===
                  "CNY"
                    ? `¥${Number(
                        transaction.amount
                      ).toFixed(2)} CNY`
                    : `$${Number(
                        transaction.amount
                      ).toFixed(2)} ${transaction.currency}`}
                </p>
  
                <div className="mt-5 space-y-2 break-all text-sm">
                  <p>
                    <span className="text-gray-500">
                      Event ID：
                    </span>
  
                    {transaction.provider_event_id ??
                      "—"}
                  </p>
  
                  <p>
                    <span className="text-gray-500">
                      Session ID：
                    </span>
  
                    {transaction.provider_session_id ??
                      "—"}
                  </p>
  
                  <p>
                    <span className="text-gray-500">
                      Payment ID：
                    </span>
  
                    {transaction.provider_payment_id ??
                      "—"}
                  </p>
  
                  <p>
                    <span className="text-gray-500">
                      交易時間：
                    </span>
  
                    {new Date(
                      transaction.created_at
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    );
  }