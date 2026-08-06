import { z } from "zod";

export const serviceSchema = z.object({
    title: z.string().min(1, "请输入服务名称"),
  
    shortDescription: z.string().min(1, "请输入简短描述"),
  
    description: z.string().min(1, "请输入详细介绍"),
  
    price: z.string().min(1, "请输入价格"),
  
    duration: z.string().min(1, "请输入办理时间"),
  
    requirements: z.string().min(1, "请输入所需文件"),
  });