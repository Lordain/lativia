"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  signInAdmin,
} from "@/lib/auth/signInAdmin";


export default function AdminLoginForm() {
  const router =
    useRouter();

  const [
    username,
    setUsername,
  ] =
    useState(
      ""
    );

  const [
    password,
    setPassword,
  ] =
    useState(
      ""
    );

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(
      false
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(
      null
    );


  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(
      true
    );

    setError(
      null
    );


    try {
      const result =
        await signInAdmin({
          username,
          password,
        });


      if (
        !result.success
      ) {
        setError(
          result.error ??
            "登录失败"
        );

        return;
      }


      router.replace(
        "/admin"
      );

      router.refresh();

    } catch {
      console.error(
        "Admin login failed"
      );

      setError(
        "登录失败，请稍后再试"
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
        handleSubmit
      }
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="admin-username"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          管理员用户名
        </label>

        <input
          id="admin-username"
          name="username"
          type="text"
          value={
            username
          }
          onChange={
            event =>
              setUsername(
                event.target.value
              )
          }
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={
            false
          }
          required
          className="
            min-h-12
            w-full
            rounded-xl
            border
            border-slate-300
            bg-white
            px-4
            text-slate-950
            outline-none
            transition
            focus:border-blue-600
            focus:ring-4
            focus:ring-blue-100
          "
          placeholder="请输入管理员用户名"
        />
      </div>


      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          密码
        </label>

        <div className="relative">
          <input
            id="admin-password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={
              password
            }
            onChange={
              event =>
                setPassword(
                  event.target.value
                )
            }
            autoComplete="current-password"
            required
            className="
              min-h-12
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4
              pr-14
              text-slate-950
              outline-none
              transition
              focus:border-blue-600
              focus:ring-4
              focus:ring-blue-100
            "
            placeholder="请输入密码"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                current =>
                  !current
              )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              rounded-lg
              px-2
              py-1
              text-xs
              font-semibold
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-800
            "
          >
            {showPassword
              ? "隐藏"
              : "显示"}
          </button>
        </div>
      </div>


      {error && (
        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            font-medium
            text-red-700
          "
        >
          {error}
        </div>
      )}


      <button
        type="submit"
        disabled={
          loading
        }
        className="
          flex
          min-h-12
          w-full
          items-center
          justify-center
          rounded-xl
          bg-slate-950
          px-5
          text-sm
          font-bold
          text-white
          shadow-sm
          transition
          hover:bg-slate-800
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading
          ? "正在验证..."
          : "进入管理后台"}
      </button>
    </form>
  );
}