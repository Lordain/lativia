interface Props {
    keyword: string;
    onChange: (value: string) => void;
  }
  
  export default function SearchBar({
    keyword,
    onChange,
  }: Props) {
    return (
      <div className="mb-8">
        <input
          type="text"
          placeholder="搜尋服務，例如 RFC、CURP..."
          value={keyword}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border p-4"
        />
      </div>
    );
  }