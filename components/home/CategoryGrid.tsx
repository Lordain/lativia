"use client";

import { useState } from "react";

import SearchBar from "@/components/home/SearchBar";
import ServiceCard from "@/components/home/ServiceCard";
import { services } from "@/data/services";

export default function CategoryGrid() {

  const [keyword, setKeyword] = useState("");

  const filteredServices = services.filter((service) => {
    const text = keyword.toLowerCase();

    return (
      service.title.toLowerCase().includes(text) ||
      service.shortDescription.toLowerCase().includes(text)
    );
  });

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">

        <h2 className="mb-8 text-2xl font-bold">
          热门办理服务
        </h2>

        <SearchBar
          keyword={keyword}
          onChange={setKeyword}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>

      </div>
    </section>
  );
}