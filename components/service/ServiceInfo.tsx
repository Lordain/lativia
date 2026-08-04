interface Props {
    price: string;
    duration: string;
  }
  
  export default function ServiceInfo({
    price,
    duration,
  }: Props) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">
            費用
          </p>
  
          <p className="text-xl font-bold">
            {price}
          </p>
        </div>
  
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">
            辦理時間
          </p>
  
          <p className="text-xl font-bold">
            {duration}
          </p>
        </div>
      </div>
    );
  }