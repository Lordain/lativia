"use client";

import { useState } from "react";
import { ServiceFormData } from "@/types/service";
import { useForm } from "react-hook-form";
import { serviceSchema } from "@/lib/validation/serviceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/ui/FormField";

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
      resolver: zodResolver(serviceSchema),
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
  
        

        <FormField
          label="服务名称"
          error={errors.title?.message}
        >
          <input
            type="text"
            placeholder="例如：RFC"
            {...register("title")}
            className={`w-full rounded-lg border p-3 ${
              errors.title
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
        </FormField>
  
        <div>
          <label className="mb-2 block font-medium">
            简短描述
          </label>
  
          <input
            type="text"
            placeholder="例如：墨西哥税号申请"  
            {...register("shortDescription")}
            className={`w-full rounded-lg border p-3 ${
              errors.shortDescription
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.shortDescription && (
            <p className="mt-1 text-sm text-red-500">
            {errors.shortDescription.message}
            </p>
          )}
        </div>
  
        <div>
          <label className="mb-2 block font-medium">
            详细介绍
          </label>
  
          <textarea
            rows={5}
            {...register("description")}
            className={`w-full rounded-lg border p-3 ${
              errors.description
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">
            价格
        </label>

            <input
                type="text"
                placeholder="例如：MX$800"
                {...register("price")}
                className={`w-full rounded-lg border p-3 ${
                  errors.price
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
        </div>

        <div>
        <label className="mb-2 block font-medium">
            办理时间
        </label>

        <input
            type="text"
            placeholder="1~3 个工作日"
            {...register("duration")}
            className={`w-full rounded-lg border p-3 ${
              errors.duration
                ? "border-red-500"
                : "border-gray-300"
            }`}
        />
        {errors.duration && (
          <p className="mt-1 text-sm text-red-500">
            {errors.duration.message}
          </p>
        )}
        </div>

        <div>
            <label className="mb-2 block font-medium">
            所需文件
            </label>

            <textarea
                rows={3}
                placeholder="护照, 居留卡, CURP"
                {...register("requirements")}
                className={`w-full rounded-lg border p-3 ${
                  errors.requirements
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
            />
            {errors.requirements && (
              <p className="mt-1 text-sm text-red-500">
                {errors.requirements.message}
              </p>
            )}
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
            disabled:opacity-60
            disabled:cursor-not-allowed
          ">
  {loading
    ? "保存中..."
    : initialData
      ? "更新服务"
      : "新增服务"}
</button>

        
    </form>
  );
}