interface Props {
    requirements: string[];
  }
  
  export default function RequirementList({
    requirements,
  }: Props) {
    return (
      <>
        <h2 className="mt-10 text-2xl font-bold">
          📄 需要準備文件
        </h2>
  
        <ul className="mt-4 space-y-2">
          {requirements.map((item) => (
            <li
              key={item}
              className="rounded-md bg-gray-100 p-3"
            >
              ✅ {item}
            </li>
          ))}
        </ul>
      </>
    );
  }