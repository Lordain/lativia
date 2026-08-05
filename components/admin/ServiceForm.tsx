"use client";

import { useState } from "react";

export default function ServiceForm() {
    const [formData, setFormData] = useState({
        title: "",
        shortDescription: "",
        description: "",
        price: "",
        duration: "",
        requirements: "",
      });

    return (
      <form className="mt-8 space-y-6">
  
        <div>
          <label className="mb-2 block font-medium">
            服务名称
          </label>
  
          <input
            type="text"
            className="w-full rounded-lg border p-3"
            placeholder="例如：RFC"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
          />
        </div>
  
        <div>
          <label className="mb-2 block font-medium">
            详细介绍
          </label>
  
          <textarea
            rows={5}
            className="w-full rounded-lg border p-3"
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
            />
        </div>
  
        <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
            新增服务
        </button>
    </form>
  );
}