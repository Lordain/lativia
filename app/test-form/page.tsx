import DynamicForm from "@/components/forms/DynamicForm";

const schema = [
  {
    type: "text" as const,
    name: "curp",
    label: "CURP",
    placeholder: "请输入 CURP",
    required: true,
  },
  {
    type: "textarea" as const,
    name: "notes",
    label: "备注",
    placeholder: "请输入备注",
    required: false,
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