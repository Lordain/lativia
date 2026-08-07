import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "姓名至少两个字"),
  email: z.email("Email 格式错误"),
  password: z.string().min(6, "密码至少六位"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
});