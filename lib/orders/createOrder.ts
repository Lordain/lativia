import type { CreateOrderInput } from "@/types/order";
import { supabase } from "@/lib/supabase";

export async function createOrder(input: CreateOrderInput) {
    console.log("createOrder input:", input);
}