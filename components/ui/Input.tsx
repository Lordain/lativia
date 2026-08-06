import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({
  error = false,
  className = "",
  ...props
}: Props) {
  return (
    <input
      {...props}
      className={`
        w-full
        rounded-lg
        border
        p-3
        ${error ? "border-red-500" : "border-gray-300"}
        ${className}
      `}
    />
  );
}