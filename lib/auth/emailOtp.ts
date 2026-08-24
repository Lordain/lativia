"use client";

import {
  createClient,
} from "@/lib/supabase/client";


function normalizeEmail(
  value: string
) {
  return value
    .trim()
    .toLowerCase();
}


interface SendEmailOtpOptions {
  shouldCreateUser?:
    boolean;
}


export async function sendEmailOtp(
  email: string,
  options:
    SendEmailOtpOptions = {}
) {
  const normalizedEmail =
    normalizeEmail(
      email
    );

  if (
    !normalizedEmail
  ) {
    throw new Error(
      "请输入电子邮箱"
    );
  }

  const supabase =
    createClient();

  const {
    error,
  } =
    await supabase.auth.signInWithOtp({
      email:
        normalizedEmail,

      options: {
        shouldCreateUser:
          options
            .shouldCreateUser ??
          true,
      },
    });

  if (
    error
  ) {
    throw new Error(
      error.message
    );
  }
}


export async function verifyEmailOtp(
  email: string,
  token: string
) {
  const normalizedEmail =
    normalizeEmail(
      email
    );

  const normalizedToken =
    token
      .trim()
      .replace(
        /\s/g,
        ""
      );

  if (
    !normalizedEmail
  ) {
    throw new Error(
      "请输入电子邮箱"
    );
  }

  if (
    !normalizedToken
  ) {
    throw new Error(
      "请输入验证码"
    );
  }

  const supabase =
    createClient();

  const {
    data,
    error,
  } =
    await supabase.auth.verifyOtp({
      email:
        normalizedEmail,

      token:
        normalizedToken,

      type:
        "email",
    });

  if (
    error
  ) {
    throw new Error(
      error.message
    );
  }

  if (
    !data.user ||
    !data.session
  ) {
    throw new Error(
      "邮箱验证失败，请重新发送验证码"
    );
  }

  return data;
}