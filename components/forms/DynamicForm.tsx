import type { FormFieldSchema } from "@/types/form";

interface Props {
    schema: FormFieldSchema[];
}

export default function DynamicForm({ schema }: Props) {
    return (
        <div className="space-y-6">

            {schema.map((field) => (

                <div
                key={field.name}
                className="space-y-2"
                >

                <label className="font-medium">

                    {field.label}

                </label>

                <input
                    type="text"
                    placeholder={field.placeholder}
                    className="
                    w-full
                    rounded-lg
                    border
                    p-3
                    "
                />

                </div>

            ))}

        </div>
    );
}