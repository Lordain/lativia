import DynamicForm from "@/components/forms/DynamicForm";

const schema = [
  {
    type: "text",
    name: "curp",
    label: "CURP",
    placeholder: "请输入 CURP",
  },
  {
    type: "text",
    name: "rfc",
    label: "RFC",
    placeholder: "请输入 RFC",
  },
];

export default function TestFormPage() {
  return (
    <main className="mx-auto max-w-xl p-10">

      <h1 className="mb-8 text-3xl font-bold">

        Dynamic Form 测试

      </h1>

      <DynamicForm
        schema={schema}
      />

    </main>
  );
}