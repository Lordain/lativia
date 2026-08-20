export interface FormFieldOption {
  label:
    string;

  value:
    string;
}


export interface FormFieldSchema {
  name:
    string;

  label:
    string;

  type:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "date"
    | "textarea"
    | "select";

  placeholder?:
    string;

  helperText?:
    string;

  required?:
    boolean;

  options?:
    FormFieldOption[];
}