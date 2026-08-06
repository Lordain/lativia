import React from "react";

interface Props
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export default function Textarea({
  error = false,
  className = "",
  ...props
}: Props) {
  return (
    <textarea
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