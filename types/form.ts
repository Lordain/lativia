export type FieldType =
  | "text"
  | "textarea"
  | "password"
  | "email"
  | "number";

export interface FormFieldSchema {
    type: FieldType;
    name: string;
    label: string;
    placeholder?: string;
    required？: boolean;
}