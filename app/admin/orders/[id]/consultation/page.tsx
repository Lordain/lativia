import {
    notFound,
  } from "next/navigation";
  
  import {
    requireAdmin,
  } from "@/lib/auth/requireAdmin";
  
  import {
    getAdminOrder,
  } from "@/lib/orders/getAdminOrder";
  
  import CetesConsultationPresentation from "@/components/consultation/CetesConsultationPresentation";
  
  
  interface Props {
    params:
      Promise<{
        id:
          string;
      }>;
  }
  
  
  export default async function AdminCetesConsultationPage({
    params,
  }: Props) {
    await requireAdmin();
  
  
    const {
      id,
    } =
      await params;
  
  
    const order =
      await getAdminOrder(
        id
      );
  
  
    if (!order) {
      notFound();
    }
  
  
    if (
      order.services
        ?.slug !==
      "cetesdirecto-consultation"
    ) {
      notFound();
    }
  
  
    if (
      order.payment_status !==
      "paid"
    ) {
      notFound();
    }
  
  
    return (
      <CetesConsultationPresentation
        orderId={
          order.id
        }
      />
    );
  }