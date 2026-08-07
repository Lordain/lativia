import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "姓名至少两个字"),
    email: z.email("Email 格式错误"),
    password: z.string().min(6, "密码至少六位"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "两次输入的密码不一致",
      path: ["confirmPassword"],
    }
  );

export const loginSchema = z.object({
  email: z.email("Email 格式错误"),
  password: z.string().min(1, "请输入密码"),
});