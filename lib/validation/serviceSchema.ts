import { z } from "zod";

export const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(
      1,
      "请输入 Slug"
    )
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug 只能使用小写英文、数字和连字符"
    ),

  title: z
    .string()
    .trim()
    .min(
      1,
      "请输入服务名称"
    ),

  shortDescription: z
    .string()
    .trim()
    .min(
      1,
      "请输入简短描述"
    ),

  description: z
    .string()
    .trim()
    .min(
      1,
      "请输入详细介绍"
    ),

  category: z
    .string()
    .trim()
    .min(
      1,
      "请输入服务分类"
    ),

  icon: z
    .string()
    .trim()
    .min(
      1,
      "请输入图标"
    ),

  price: z
    .string()
    .trim()
    .min(
      1,
      "请输入展示价格"
    ),

  duration: z
    .string()
    .trim()
    .min(
      1,
      "请输入办理时间"
    ),

  requirements: z
    .string()
    .trim(),

  popular: z.boolean(),

  isActive: z.boolean(),
});

export type ServiceSchemaData =
  z.infer<
    typeof serviceSchema
  >;