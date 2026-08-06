"use client";

import { useState } from "react";
import { ServiceFormData } from "@/types/service";
import { useForm } from "react-hook-form";

interface Props {
    initialData?: ServiceFormData;

    onSubmit: (data: ServiceFormData) => Promise<void>;
}

export default function ServiceForm({ initialData, onSubmit }: Props) {

    const [loading, setLoading] = useState(false);
        
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<ServiceFormData>({
      defaultValues: initialData ?? {
        title: "",
        shortDescription: "",
        description: "",
        price: "",
        duration: "",
        requirements: "",
      },
    });
      

      async function submitForm(data: ServiceFormData) {
        setLoading(true);
      
        try {
          await onSubmit(data);
        } finally {
          setLoading(false);
        }
      }

    return (
      <form 
      onSubmit={handleSubmit(submitForm)}
      className="mt-8 space-y-6"
      >
  
        

        <div>
          <label className="mb-2 block font-medium">
            服务名称
          </label>
  
          <input
            type="text"
            className="w-full rounded-lg border p-3"
            placeholder="例如：RFC"
            {...register("title")}
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
            {...register("shortDescription")}
          />
        </div>
  
        <div>
          <label className="mb-2 block font-medium">
            详细介绍
          </label>
  
          <textarea
            rows={5}
            className="w-full rounded-lg border p-3"
            {...register("description")}
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
                {...register("price")}
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
            {...register("duration")}
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
                {...register("requirements")}
            />
        </div>
  
        <button
  type="submit"
  disabled={loading}
  className="
    w-full
    rounded-lg
    bg-blue-600
    px-6
    py-3
    text-white
    transition
    hover:bg-blue-700
    disabled:bg-gray-400
    disabled:cursor-not-allowed
  "
>
  {loading
    ? "保存中..."
    : initialData
      ? "更新服务"
      : "新增服务"}
</button>

        
    </form>
  );
}