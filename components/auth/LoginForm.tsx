"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import type {
  LoginFormData,
} from "@/types/auth";

import {
  loginSchema,
} from "@/lib/validation/authSchema";

import {
  signIn,
} from "@/lib/auth/signIn";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";


export default function LoginForm() {
  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );

  const router =
    useRouter();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } =
    useForm<LoginFormData>({
      resolver:
        zodResolver(
          loginSchema
        ),

      defaultValues: {
        email: "",
        password: "",
      },
    });


  async function submitForm(
    data:
      LoginFormData
  ) {
    setLoading(
      true
    );

    try {
      await signIn(
        data
      );

      router.push(
        "/"
      );

      router.refresh();

    } catch (
      error
    ) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "登录失败"
      );

    } finally {
      setLoading(
        false
      );
    }
  }


  return (
    <form
      onSubmit={
        handleSubmit(
          submitForm
        )
      }
      className="space-y-4"
    >
      <FormField
        label="Email"
        error={
          errors.email
            ?.message
        }
      >
        <Input
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          error={
            !!errors.email
          }
          {...register(
            "email"
          )}
        />
      </FormField>


      <FormField
        label="密码"
        error={
          errors.password
            ?.message
        }
      >
        <Input
          type="password"
          placeholder="请输入密码"
          autoComplete="current-password"
          error={
            !!errors.password
          }
          {...register(
            "password"
          )}
        />
      </FormField>


      <button
        type="submit"
        disabled={
          loading
        }
        className="
          flex
          min-h-11
          w-full
          items-center
          justify-center
          rounded-xl
          bg-blue-700
          px-5
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-blue-800
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading
          ? "登录中..."
          : "登录"}
      </button>
    </form>
  );
}