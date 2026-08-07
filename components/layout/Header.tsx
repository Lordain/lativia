import AuthNav from "@/components/auth/AuthNav";

export default function Header() {
    return (
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold">
          MexHelper
        </h1>
        <AuthNav />
      </header>
    );
  }