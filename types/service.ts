import type {
  FormFieldSchema,
} from "./form";

export interface Service {
  id: string;

  slug: string;

  title: string;

  shortDescription: string;

  description: string;

  icon: string;

  category: string;

  popular: boolean;

  /**
   * 仅用于前台展示。
   * 实际付款金额使用 service_prices。
   */
  price: string;

  duration: string;

  requirements: string[];

  formSchema:
    FormFieldSchema[];

  isActive: boolean;

  createdAt:
    string | null;

  updatedAt:
    string | null;
}

export interface ServiceFormData {
  slug: string;

  title: string;

  shortDescription: string;

  description: string;

  category: string;

  icon: string;

  price: string;

  duration: string;

  requirements: string;

  popular: boolean;

  isActive: boolean;

  /**
   * 客户申请时需要填写的动态表单。
   */
  formSchema:
    FormFieldSchema[];
}

export interface CreateServiceInput
  extends ServiceFormData {}