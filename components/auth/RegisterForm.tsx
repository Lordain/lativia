"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { RegisterFormData } from "@/types/auth";
import { registerSchema } from "@/lib/validation/authSchema";
import { signUp } from "@/lib/auth/signUp";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function submitForm(data: RegisterFormData) {
    setLoading(true);

    try {
      await signUp(data);

      alert("注册成功，请检查 Email 完成验证。");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "注册失败，请稍后再试"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-6"
    >
      <FormField
        label="姓名"
        error={errors.name?.message}
      >
        <Input
          type="text"
          placeholder="请输入姓名"
          error={!!errors.name}
          {...register("name")}
        />
      </FormField>

      <FormField
        label="Email"
        error={errors.email?.message}
      >
        <Input
          type="email"
          placeholder="name@example.com"
          error={!!errors.email}
          {...register("email")}
        />
      </FormField>

      <FormField
        label="电话（可选）"
        error={errors.phone?.message}
      >
        <Input
          type="tel"
          error={!!errors.phone}
          {...register("phone")}
        />
      </FormField>

      <FormField
        label="密码"
        error={errors.password?.message}
      >
        <Input
          type="password"
          placeholder="至少 6 位"
          error={!!errors.password}
          {...register("password")}
        />
      </FormField>

      <FormField
        label="确认密码"
        error={errors.confirmPassword?.message}
      >
        <Input
          type="password"
          placeholder="再次输入密码"
          error={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </FormField>

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          rounded-lg
          bg-blue-600
          px-6
          py-3
          text-white
          transition
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? "注册中..." : "注册"}
      </button>
    </form>
  );
}