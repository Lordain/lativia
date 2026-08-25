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

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(
      false
    );

  const [
    showConfirmPassword,
    setShowConfirmPassword,
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
      method="post"
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
        <div className="relative">
          <Input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="至少 6 位"
            autoComplete="new-password"
            error={
              !!errors.password
            }
            className="pr-12"
            {...register(
              "password"
            )}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                current =>
                  !current
              )
            }
            aria-label={
              showPassword
                ? "隐藏密码"
                : "显示密码"
            }
            title={
              showPassword
                ? "隐藏密码"
                : "显示密码"
            }
            className="
              absolute
              right-3
              top-1/2
              flex
              h-8
              w-8
              -translate-y-1/2
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            {showPassword ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m3 3 18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c5 0 9 4 10 8a11.8 11.8 0 0 1-2 3.9" />
                <path d="M6.6 6.6C4.4 8 2.8 10 2 12c1 4 5 8 10 8a10.7 10.7 0 0 0 5.4-1.5" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />

                <circle
                  cx="12"
                  cy="12"
                  r="3"
                />
              </svg>
            )}
          </button>
        </div>
      </FormField>


      <FormField
        label="确认密码"
        error={
          errors.confirmPassword
            ?.message
        }
      >
        <div className="relative">
          <Input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="再次输入密码"
            autoComplete="new-password"
            error={
              !!errors
                .confirmPassword
            }
            className="pr-12"
            {...register(
              "confirmPassword"
            )}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                current =>
                  !current
              )
            }
            aria-label={
              showConfirmPassword
                ? "隐藏确认密码"
                : "显示确认密码"
            }
            title={
              showConfirmPassword
                ? "隐藏确认密码"
                : "显示确认密码"
            }
            className="
              absolute
              right-3
              top-1/2
              flex
              h-8
              w-8
              -translate-y-1/2
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            {showConfirmPassword ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m3 3 18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c5 0 9 4 10 8a11.8 11.8 0 0 1-2 3.9" />
                <path d="M6.6 6.6C4.4 8 2.8 10 2 12c1 4 5 8 10 8a10.7 10.7 0 0 0 5.4-1.5" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />

                <circle
                  cx="12"
                  cy="12"
                  r="3"
                />
              </svg>
            )}
          </button>
        </div>
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