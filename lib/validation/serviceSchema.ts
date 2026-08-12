import { z } from "zod";

export const formFieldSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "请输入字段名称"
      )
      .regex(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        "字段名称只能使用英文字母、数字和下划线，并且必须以英文字母开头"
      ),

    label: z
      .string()
      .trim()
      .min(
        1,
        "请输入显示名称"
      ),

    type: z.enum([
      "text",
      "email",
      "tel",
      "number",
      "date",
      "textarea",
    ]),

    /*
     * 与 FormFieldSchema 保持一致：
     * placeholder 可以不存在
     */
    placeholder:
      z
        .string()
        .optional(),

    /*
     * required 也可以不存在。
     * DynamicForm 会把 undefined
     * 当成非必填处理。
     */
    required:
      z
        .boolean()
        .optional(),
  });

export const serviceSchema =
  z
    .object({
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

      shortDescription:
        z
          .string()
          .trim()
          .min(
            1,
            "请输入简短描述"
          ),

      description:
        z
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

      requirements:
        z
          .string()
          .trim(),

      popular:
        z.boolean(),

      isActive:
        z.boolean(),

      formSchema:
        z.array(
          formFieldSchema
        ),
    })
    .superRefine(
      (
        data,
        ctx
      ) => {
        const names =
          new Set<string>();

        data.formSchema.forEach(
          (
            field,
            index
          ) => {
            const normalized =
              field.name
                .trim()
                .toLowerCase();

            if (
              names.has(
                normalized
              )
            ) {
              ctx.addIssue({
                code:
                  "custom",

                path: [
                  "formSchema",
                  index,
                  "name",
                ],

                message:
                  "字段名称不能重复",
              });
            }

            names.add(
              normalized
            );
          }
        );
      }
    );

export type ServiceSchemaData =
  z.infer<
    typeof serviceSchema
  >;