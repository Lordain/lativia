import type {
    ReactNode,
  } from "react";
  
  import Header from "@/components/layout/Header";
  import Footer from "@/components/layout/Footer";
  
  
  interface PublicShellProps {
    children: ReactNode;
  }
  
  
  export default function PublicShell({
    children,
  }: PublicShellProps) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
  
        <div className="flex-1">
          {children}
        </div>
  
        <Footer />
      </div>
    );
  }