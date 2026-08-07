"use client";

import { useRouter } from "next/navigation";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteService } from "@/lib/services/deleteService";

interface Props {
  id: string;
}

export default function DeleteServiceContainer({ id }: Props) {
  const router = useRouter();

  async function handleDelete() {
    await deleteService(id);

    router.refresh();
  }
  return (
    <DeleteButton onDelete={handleDelete} />
  );  }