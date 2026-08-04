import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";  
import CategoryGrid from "@/components/home/CategoryGrid";

export default function Home() {
  return (
    <>
      <Header />

      <Hero />

      <CategoryGrid />

      <Footer />
    </>
  );
}