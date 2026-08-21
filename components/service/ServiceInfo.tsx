interface PriceSummaryItem {
  label:
    string;

  price:
    string;
}


interface Props {
  price:
    string;

  duration:
    string;

  priceSummary?:
    PriceSummaryItem[];
}


export default function ServiceInfo({
  price,
  duration,
  priceSummary = [],
}: Props) {
  const hasPriceSummary =
    priceSummary.length >
    0;


  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">
          费用
        </p>

        {hasPriceSummary ? (
          <div className="mt-3 space-y-3">
            {priceSummary.map(
              item => (
                <div
                  key={
                    item.label
                  }
                >
                  <p className="text-sm text-gray-600">
                    {
                      item.label
                    }
                  </p>

                  <p className="text-xl font-bold">
                    {
                      item.price
                    }
                  </p>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="mt-1 text-xl font-bold">
            {
              price
            }
          </p>
        )}
      </div>

      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">
          办理时间
        </p>

        <p className="mt-1 text-xl font-bold">
          {
            duration
          }
        </p>
      </div>
    </div>
  );
}