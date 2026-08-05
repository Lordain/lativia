import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";  
import CategoryGrid from "@/components/home/CategoryGrid";
import { getServices } from "@/lib/services/getServices";

export default async function Home() {
  const services = await getServices();

  return (
    <>
      <Header />

      <Hero />

      <CategoryGrid services={services} />

      <Footer />
    </>
  );
}