export interface Order {

    id:string;

    userId:string;

    serviceId:string;

    status:string;

    formData:Record<string,string>;

    createdAt:string;

}

export interface CreateOrderInput {
    serviceId:string;
    formData:Record<string,string>;
}

