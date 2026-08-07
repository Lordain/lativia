"use client";

interface Props {
  onDelete: () => Promise<void>;
}

export default function DeleteButton({ onDelete }: Props) {
  async function handleClick() {
    console.log("Delete clicked");

    const confirmed = confirm("确定要删除这个服务吗？");

    if (!confirmed) return;

    await onDelete();
  }

  return (
    <button
      onClick={handleClick}
      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
    >
      删除
    </button>
  );
}