import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main className="p-10">
        <h2 className="text-4xl font-bold">
          墨西哥華人辦事平台
        </h2>

        <p className="mt-4">
          在墨西哥，不懂西班牙文也能輕鬆辦事。
        </p>
      </main>

      <Footer />
    </>
  );
}