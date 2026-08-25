"use client";

import {
  useEffect,
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


const REMEMBERED_EMAIL_KEY =
  "lativia_remembered_email";


export default function LoginForm() {
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
    rememberAccount,
    setRememberAccount,
  ] =
    useState(
      false
    );

  const router =
    useRouter();

  const {
    register,
    handleSubmit,
    setValue,
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


  /*
   * ========================================
   * Remember Account
   * ========================================
   *
   * 只保存 Email。
   *
   * Lativia 不自行保存用户密码。
   * 密码保存交给浏览器 / 系统密码管理器。
   */

  useEffect(
    () => {
      try {
        const rememberedEmail =
          window.localStorage
            .getItem(
              REMEMBERED_EMAIL_KEY
            )
            ?.trim();

        if (
          rememberedEmail
        ) {
          setValue(
            "email",
            rememberedEmail
          );

          setRememberAccount(
            true
          );
        }

      } catch (
        error
      ) {
        console.warn(
          "Unable to restore remembered login email:",
          error
        );
      }
    },
    [
      setValue,
    ]
  );


  async function submitForm(
    data:
      LoginFormData
  ) {
    setLoading(
      true
    );

    try {
      /*
       * 只允许保存 Email。
       */

      try {
        if (
          rememberAccount
        ) {
          window.localStorage
            .setItem(
              REMEMBERED_EMAIL_KEY,
              data.email
                .trim()
                .toLowerCase()
            );

        } else {
          window.localStorage
            .removeItem(
              REMEMBERED_EMAIL_KEY
            );
        }

      } catch (
        error
      ) {
        console.warn(
          "Unable to update remembered login email:",
          error
        );
      }


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
      method="post"
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
        <div className="relative">
          <Input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="请输入密码"
            autoComplete="current-password"
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


      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={
            rememberAccount
          }
          onChange={
            event =>
              setRememberAccount(
                event.target
                  .checked
              )
          }
          className="h-4 w-4 rounded border-slate-300 text-blue-700 accent-blue-700"
        />

        <span>
          记住账号
        </span>
      </label>


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