"use client";

import { useState } from "react";
import { ServiceFormData } from "@/types/service";
import { createService } from "@/lib/services/createService";

export default function ServiceForm() {

    const [formData, setFormData] = useState<ServiceFormData>({
        title: "",
        shortDescription: "",
        description: "",
        price: "",
        duration: "",
        requirements: "",
      });
    
      function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) {
        const { name, value } = e.target;
    
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
          await createService(formData);

          alert("新增成功！");
        } catch (error) {
          console.error(error);
          alert("新增失败！");
        }
      }

    return (
      <form 
      onSubmit={handleSubmit}
      className="mt-8 space-y-6"
      >
  
        

        <div>
          <label className="mb-2 block font-medium">
            服务名称
          </label>
  
          <input
            type="text"
            name="title"
            className="w-full rounded-lg border p-3"
            placeholder="例如：RFC"
            value={formData.title}
            onChange={handleChange}
          />

        </div>
  
        <div>
          <label className="mb-2 block font-medium">
            简短描述
          </label>
  
          <input
            type="text"
            className="w-full rounded-lg border p-3"
            placeholder="例如：墨西哥税号申请"  
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
          />
        </div>
  
        <div>
          <label className="mb-2 block font-medium">
            详细介绍
          </label>
  
          <textarea
            rows={5}
            className="w-full rounded-lg border p-3"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            价格
        </label>

            <input
                type="text"
                className="w-full rounded-lg border p-3"
                placeholder="例如：MX$800"
                name="price"
                value={formData.price}
                onChange={handleChange}
            />
        </div>

        <div>
        <label className="mb-2 block font-medium">
            办理时间
        </label>

        <input
            type="text"
            className="w-full rounded-lg border p-3"
            placeholder="1~3 个工作日"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
        />
        </div>

        <div>
            <label className="mb-2 block font-medium">
            所需文件
            </label>

            <textarea
                rows={3}
                className="w-full rounded-lg border p-3"
                placeholder="护照, 居留卡, CURP"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
            />
        </div>
  
        <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
            新增服务
        </button>

        
    </form>
  );
}