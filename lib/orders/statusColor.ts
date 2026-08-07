import type { OrderStatus } from "@/types/order";

export function getStatusColor(status:OrderStatus){

    switch(status){
    
    case "pending":
    
    return "bg-yellow-100 text-yellow-700";
    
    case "processing":
    
    return "bg-blue-100 text-blue-700";
    
    case "waiting_documents":
    
    return "bg-orange-100 text-orange-700";
    
    case "completed":
    
    return "bg-green-100 text-green-700";
    
    case "cancelled":
    
    return "bg-red-100 text-red-700";
    
    }
    
    }