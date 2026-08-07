export interface Service {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    description: string;
    icon: string;
    category: string;
    popular: boolean;
    price: string;
    duration: string;
    requirements: string[];
    formFields: FormFieldSchema[];
}

export interface ServiceFormData {
    title: string;
    shortDescription: string;
    description: string;
    price: string;
    duration: string;
    requirements: string;
}

export interface CreateServiceInput {
    title: string;
    shortDescription: string;
    description: string;
    price: string;
    duration: string;
    requirements: string;
    slug: string;
    icon: string;
    category: string;
    popular: boolean;
  }

export interface FormFieldSchema {
    type: "text" | "textarea" | "password";
    name: string;
    label: string;
    placeholder?: string;
    required: boolean;
}