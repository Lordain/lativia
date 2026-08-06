import type { Service } from "@/types/service";

interface Props {
    service: Service;
}

export default function ServiceRow({ service }: Props) {
    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
                <h2 className="font-semibold">{service.title}</h2>
                <p className="text-sm text-gray-500">{service.shortDescription}</p>
            </div>
            <div className="flex gap-2">
                <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">编辑</button>
                <button className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-700">删除</button>
            </div>
        </div>
    );
}