import {
  z,
} from "zod";

/*
 * =====================================
 * Dynamic Order Form Field
 * =====================================
 */

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

    placeholder:
      z
        .string()
        .optional(),

    required:
      z
        .boolean()
        .optional(),
  });

/*
 * =====================================
 * Eligibility
 * =====================================
 */

const eligibilityItemSchema =
  z.object({
    key: z
      .string()
      .trim()
      .min(
        1,
        "请输入条件 Key"
      )
      .regex(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        "Key 只能使用英文字母、数字和下划线，并且必须以英文字母开头"
      ),

    label: z
      .string()
      .trim()
      .min(
        1,
        "请输入条件说明"
      ),

    required:
      z.boolean(),
  });

/*
 * =====================================
 * Completion Milestone
 * =====================================
 */

const completionMilestoneSchema =
  z.object({
    key: z
      .string()
      .trim()
      .min(
        1,
        "请输入节点 Key"
      )
      .regex(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        "Key 只能使用英文字母、数字和下划线，并且必须以英文字母开头"
      ),

    label: z
      .string()
      .trim()
      .min(
        1,
        "请输入节点说明"
      ),

    required:
      z.boolean(),
  });

/*
 * =====================================
 * Service Form Schema
 * =====================================
 */

export const serviceSchema =
  z
    .object({
      /*
       * Basic
       */

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

      /*
       * Service Settings
       */

      serviceType:
        z.enum([
          "online_query",
          "accompaniment",
          "agency",
          "consultation",
        ]),

      launchPriority:
        z.enum([
          "first",
          "second",
        ]),

      serviceStatus:
        z.enum([
          "active",
          "paused",
          "hidden",
        ]),

      /*
       * Eligibility
       */

      eligibilityMode:
        z.enum([
          "none",
          "self_check",
        ]),

      eligibilitySchema:
        z.array(
          eligibilityItemSchema
        ),

      /*
       * Customer Order Form
       */

      formSchema:
        z.array(
          formFieldSchema
        ),

      /*
       * Execution
       */

      workspaceRequired:
        z.boolean(),

      completionMode:
        z.enum([
          "manual",
          "time_based",
          "milestone_based",
          "time_or_milestone",
        ]),

      accessDurationDays:
        z
          .number()
          .int(
            "服务有效天数必须是整数"
          )
          .positive(
            "服务有效天数必须大于 0"
          )
          .nullable(),

      completionMilestones:
        z.array(
          completionMilestoneSchema
        ),

      /*
       * Result
       */

      expectedOutcome:
        z
          .string()
          .trim()
          .min(
            1,
            "请说明客户最终获得什么"
          ),

      resultIsOfficial:
        z.boolean(),

      resultRequired:
        z.boolean(),

      hasResultFile:
        z.boolean(),

      /*
       * Refund
       */

      refundEligibleWhenFailed:
        z.boolean(),
    })
    .superRefine(
      (
        data,
        ctx
      ) => {
        /*
         * =====================================
         * Dynamic Form Duplicate Names
         * =====================================
         */

        const formNames =
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
              formNames.has(
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

            formNames.add(
              normalized
            );
          }
        );

        /*
         * =====================================
         * Eligibility
         * =====================================
         */

        if (
          data.eligibilityMode ===
            "self_check" &&
          data
            .eligibilitySchema
            .length ===
            0
        ) {
          ctx.addIssue({
            code:
              "custom",

            path: [
              "eligibilitySchema",
            ],

            message:
              "请选择付款前确认时，请至少添加一个办理条件",
          });
        }

        const eligibilityKeys =
          new Set<string>();

        data
          .eligibilitySchema
          .forEach(
            (
              item,
              index
            ) => {
              const normalized =
                item.key
                  .trim()
                  .toLowerCase();

              if (
                eligibilityKeys.has(
                  normalized
                )
              ) {
                ctx.addIssue({
                  code:
                    "custom",

                  path: [
                    "eligibilitySchema",
                    index,
                    "key",
                  ],

                  message:
                    "条件 Key 不能重复",
                });
              }

              eligibilityKeys.add(
                normalized
              );
            }
          );

        /*
         * =====================================
         * Completion Duration
         * =====================================
         */

        if (
          (
            data.completionMode ===
              "time_based" ||
            data.completionMode ===
              "time_or_milestone"
          ) &&
          data.accessDurationDays ===
            null
        ) {
          ctx.addIssue({
            code:
              "custom",

            path: [
              "accessDurationDays",
            ],

            message:
              "此完成方式需要填写服务有效天数",
          });
        }

        /*
         * =====================================
         * Completion Milestones
         * =====================================
         */

        if (
          (
            data.completionMode ===
              "milestone_based" ||
            data.completionMode ===
              "time_or_milestone"
          ) &&
          data
            .completionMilestones
            .length ===
            0
        ) {
          ctx.addIssue({
            code:
              "custom",

            path: [
              "completionMilestones",
            ],

            message:
              "此完成方式需要至少添加一个完成节点",
          });
        }

        const milestoneKeys =
          new Set<string>();

        data
          .completionMilestones
          .forEach(
            (
              milestone,
              index
            ) => {
              const normalized =
                milestone.key
                  .trim()
                  .toLowerCase();

              if (
                milestoneKeys.has(
                  normalized
                )
              ) {
                ctx.addIssue({
                  code:
                    "custom",

                  path: [
                    "completionMilestones",
                    index,
                    "key",
                  ],

                  message:
                    "完成节点 Key 不能重复",
                });
              }

              milestoneKeys.add(
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