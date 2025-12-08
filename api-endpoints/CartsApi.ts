import axios from "axios";
import ApiUrls from "./ApiUrls";

// CREATE CART APIS 
export const postCartCreateApi = async (query: any, payload: any) => {
    return axios.post(
        `${ApiUrls.cartCreate}${query}`, payload
    );
};

// GET CART APIS 
export const getCartApi = async (query: any) => {
    return axios.get(
        `${ApiUrls.cartCreate}${query}`
    );
};

// CREATE ADDRESS APIS 
export const postAddressCreateApi = async (query: any, payload: any) => {
    return axios.post(
        `${ApiUrls.addresses}${query}`, payload
    );
};

// GET ADDRESS APIS 
export const getAddressApi = async (query: any) => {
    const formattedQuery = query.endsWith('/') ? query : `${query}/`;
    return axios.get(`${ApiUrls.addresses}${formattedQuery}`);
};


// UPDATE ADDRESS APIS 
export const updateAddressApi = async (query: any, payload: any) => {
    return axios.put(
        `${ApiUrls.addresses}${query}/`, payload
    );
};

// DELETE ADDRESS APIS 
export const deleteAddressApi = async (query: any, payload: any) => {
    return axios.delete(`${ApiUrls.addresses}${query}`, { data: payload }); 
  };



// POST CARTITEM APIS 
export const postCartitemApi = async (query: any, payload: any) => {
    return axios.post(
        `${ApiUrls.cartItemsUpdate}${query}`, payload
    );
};

// GET CARTITEMS APIS 
export const getCartitemsApi = async (query: any) => {
    const formattedQuery = query.endsWith('/') ? query : `${query}/`;
    return axios.get(`${ApiUrls.cartItems}${formattedQuery}`);
};

// UPDATE CARTITEMS APIS 
export const updateCartitemsApi = async (query: any) => {
    return axios.patch(
        `${ApiUrls.cartItem}${query}`
    );
};

// DELETE CARTITEMS APIS 
export const deleteCartitemsApi = async (query: any) => {
    const formattedQuery = query?.endsWith('/') ? query : `${query}/`;
    return axios.delete(`${ApiUrls.cartItem}${formattedQuery}`);
};


// ORDERS APIS 


// CREATE ORDER APIS 
export const postOrderItemApi = async (query: any, payload: any) => {
    return axios.post(
        `${ApiUrls.orderItem}${query}`, payload
    );
};

// GET ORDER APIS 
export const getOrderItemApi = async (query: any) => {
    const formattedQuery = query.endsWith('/') ? query : `${query}`;
    return axios.get(`${ApiUrls.orderItem}${formattedQuery}`);
};



// GET ORDER APIS 
export const getOrderApi = async (query: any) => {
    const formattedQuery = query.endsWith('/') ? query : `${query}/`;
    return axios.get(`${ApiUrls.orderGet}${formattedQuery}`);
};


// ORDERS AND ORDER ITEMS APIS

export const getOrdersAndOrdersItemsApi = async (query: any) => {
    const formattedQuery = query.endsWith('/') ? query : `${query}`;
    return axios.get(`${ApiUrls.ordersAndOrderItems}${formattedQuery}`);
};

// END ORDER APIS


// COUPONS APIS
// POST APPLY COUPONS APIS
export const postApplyCouponApi = async (query: any, payload: any) => {
    const formattedQuery = query.endsWith('/') ? query : `${query}/`;
    return axios.post(
        `${ApiUrls.applyCoupons}${formattedQuery}`, payload
    );
};

// APPLIED COUPON DATA APIS
export const getAppliedCouponDataApi = async (query: any) => {
    const formattedQuery = query.endsWith('/') ? query : `${query}`;
    return axios.get(`${ApiUrls.appliedCouponData}${formattedQuery}`);
};

// DELETE COUPON API
export const deleteCouponApi = async (query: any,payload:any) => {
    const formattedQuery = query.endsWith('/') ? query : `${query}/`;
    return axios.delete(`${ApiUrls.removeCoupon}${formattedQuery}`, { data: payload });
};

// END COUPON API

// POST PAYMENT API APIS
export const postPaymentApi = async (query: any, payload: any) => {
    return axios.post(`${ApiUrls.paymentApi}${query}/`, payload);
  };

  // POST DTDC DELIVERY CHARGE API APIS
export const postDtdcChargeApi = async (query: any, payload: any) => {
    return axios.post(`${ApiUrls.checkDtdcCharge}${query}`, payload);
  };

  // POST COD PAYMENT API APIS
export const postCODPaymentApi = async (query: any, payload: any) => {
    return axios.post(`${ApiUrls.codPay}${query}`, payload);
  };
  
  // GET ALL COUPONS API
export const getAllCouponsApi = async (query: any) => {
    return axios.get(`${ApiUrls.coupons}${query}`);
}









