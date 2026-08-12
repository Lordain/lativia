import Link from "next/link";

interface Props {
  adminName:
    string | null;
}

export default function AdminHeader({
  adminName,
}: Props) {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-8">
        <div>
          <p className="text-sm text-gray-500">
            后台管理
          </p>

          <p className="font-medium">
            {adminName ??
              "管理员"}
          </p>
        </div>

        <Link
          href="/"
          className="
            rounded-lg
            border
            px-4
            py-2
            text-sm
            hover:bg-gray-50
          "
        >
          返回网站
        </Link>
      </div>
    </header>
  );
}