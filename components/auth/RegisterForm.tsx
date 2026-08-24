"use client";

import {
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import type {
  RegisterFormData,
} from "@/types/auth";

import {
  registerSchema,
} from "@/lib/validation/authSchema";

import {
  signUp,
} from "@/lib/auth/signUp";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";


export default function RegisterForm() {
  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } =
    useForm<RegisterFormData>({
      resolver:
        zodResolver(
          registerSchema
        ),

      defaultValues: {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      },
    });


  async function submitForm(
    data:
      RegisterFormData
  ) {
    setLoading(
      true
    );

    try {
      await signUp(
        data
      );

      alert(
        "注册成功"
      );

    } catch (
      error
    ) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "注册失败，请稍后再试"
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
        label="姓名"
        error={
          errors.name
            ?.message
        }
      >
        <Input
          type="text"
          placeholder="请输入姓名"
          autoComplete="name"
          error={
            !!errors.name
          }
          {...register(
            "name"
          )}
        />
      </FormField>


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
        label="电话（可选）"
        error={
          errors.phone
            ?.message
        }
      >
        <Input
          type="tel"
          placeholder="例如：55 1234 5678"
          autoComplete="tel"
          error={
            !!errors.phone
          }
          {...register(
            "phone"
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
          placeholder="至少 6 位"
          autoComplete="new-password"
          error={
            !!errors.password
          }
          {...register(
            "password"
          )}
        />
      </FormField>


      <FormField
        label="确认密码"
        error={
          errors.confirmPassword
            ?.message
        }
      >
        <Input
          type="password"
          placeholder="再次输入密码"
          autoComplete="new-password"
          error={
            !!errors
              .confirmPassword
          }
          {...register(
            "confirmPassword"
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
          ? "创建中..."
          : "创建账号"}
      </button>


      <p className="text-xs leading-5 text-slate-400">
        请设置仅用于 Lativia
        登录的密码。请勿在此填写银行密码、
        OTP、Token、CVV 或 e.firma 私钥密码。
      </p>
    </form>
  );
}