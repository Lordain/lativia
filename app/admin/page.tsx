import Link from "next/link";

export default function AdminPage() {
    return (
        <main className="mx-auto max-w-4xl p-10">
            <h1 className="text-4xl font-bold">
                Admin Dashboard
            </h1>

            <Link 
                href="/admin/services/new" 
                className="mt-8 inline-block rounded bg-blue-600 px-6 py-3 text-white">
                + 新增服务
            </Link>
        </main>
    );
}