export interface FormFieldSchema {
  name: string;

  label: string;

  type:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "date"
    | "textarea";

  placeholder?: string;

  required?: boolean;
}