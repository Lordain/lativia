"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { LoginFormData } from "@/types/auth";
import { loginSchema } from "@/lib/validation/authSchema";
import { signIn } from "@/lib/auth/signIn";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function submitForm(data: LoginFormData) {
    setLoading(true);

    try {
      await signIn(data);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "登录失败"
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
        label="密码"
        error={errors.password?.message}
      >
        <Input
          type="password"
          placeholder="请输入密码"
          error={!!errors.password}
          {...register("password")}
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
        {loading ? "登录中..." : "登录"}
      </button>
    </form>
  );
}