"use client";

import { useState } from "react";
import { ServiceFormData } from "@/types/service";
import { useForm } from "react-hook-form";
import { serviceSchema } from "@/lib/validation/serviceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

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
          <Input
              type="text"
              placeholder="例如：RFC"
              error={!!errors.title}
              {...register("title")}
          />
        </FormField>
  
        <FormField
          label="简短描述"
          error={errors.shortDescription?.message}
        >
          <Input
            type="text"
            placeholder="例如：墨西哥税号申请"
            error={!!errors.shortDescription}
            {...register("shortDescription")}
          />
        </FormField>
  
        <FormField
          label="详细介绍"
          error={errors.description?.message}
        >

          <Textarea
            rows={5}
            error={!!errors.description}
            {...register("description")}
          />
        </FormField>

        <FormField
          label="价格"
          error={errors.price?.message}
        >
          <Input 
            type="text"
            placeholder="例如：MX$800"
            error={!!errors.price}
            {...register("price")}
          />
        </FormField>
        
        <FormField
          label="办理时间"
          error={errors.duration?.message}
        >
          <Input  
            type="text"
            placeholder="1~3 个工作日"
            error={!!errors.duration}
            {...register("duration")}
          />
        </FormField>

        <FormField
          label="所需文件"
          error={errors.requirements?.message}
        >
          <Textarea
            rows={3}
            placeholder="护照, 居留卡, CURP"
            error={!!errors.requirements}
            {...register("requirements")}
          />
        </FormField>
  
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