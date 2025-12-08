import axios from "axios";
import ApiUrls from "./ApiUrls";

// SIGNIN API
export const postSignInAPi = async (payload:any) => {
    return axios.post(ApiUrls.signIn,payload);
  }; 
  
//   USER CREATE API
  export const postCreateUserAPi = async (payload:any) => {
    return axios.post(ApiUrls.createUsers,payload);
  };

  //   USER GET API
  export const getUserAPi = async (id:any) => {
    const formattedQuery = id.endsWith('/') ? id : `${id}/`;
    return axios.get(`${ApiUrls.users}/${formattedQuery}`);
  };

// USER SELECT ADDRESS
export const patchUserSelectAddressAPi = async (query:any,payload:any) => {
  return axios.patch(`${ApiUrls.updateSelectedAddress}/${query}/`,payload);
};

// CHECK EMAIL API
export const getCheckEmailApi = async (id:any) => {
  const formattedQuery = id.endsWith('/') ? id : `${id}`;
  return axios.get(`${ApiUrls.checkEmail}${formattedQuery}`);
};

// SEND OTP API 
export const postSendOtpAPi = async (payload:any) => {
  return axios.post(ApiUrls.sendOtp,payload);
};

// SEND OTP VERIFY API 
export const postSendOtpVerifyAPi = async (payload:any) => {
  return axios.post(ApiUrls.verifyOtp,payload);
};

// USER UPDATE API 
export const updateUserAPi = async (id:any,payload:any) => {
  const formattedQuery = id.endsWith('/') ? id : `${id}/`;
  return axios.patch(`${ApiUrls.users}${formattedQuery}`,payload);
};

// VENDOR OTHER DETAILS API 
export const getVendorOtherDetailsApi = async (id:any) => {
  const formattedQuery = id.endsWith('/') ? id : `${id}`;
  return axios.get(`${ApiUrls.vendorOtherDetails}${formattedQuery}`);
};

// VENDOR POLICY DEATILS API
export const getVendorSitePoliciesApi = async (id:any) => {
  const formattedQuery = id.endsWith('/') ? id : `${id}`;
  return axios.get(`${ApiUrls.vendorSitePolicies}${formattedQuery}`);
};

// VENDOR DELIVERY DETAILS API
export const getVendorDeliveryDetailsApi = async (id:any) => {
  const formattedQuery = id.endsWith('/') ? id : `${id}`;
  return axios.get(`${ApiUrls?.vendorDetailsDelivery}${formattedQuery}/`);
};

// GET DELIVERY CHARGE API
export const getDeliveryChargeApi = async (id:any,payload:any) => {
  const formattedQuery = id.endsWith('/') ? id : `${id}`;
  return axios.post(`${ApiUrls?.checkCourierCharge}${formattedQuery}`,payload);
};

// GET SMS OTP API
export const postSendSmsOtpUserApi = async (payload:any) => {
  return axios.post(ApiUrls.sendSmsOtpUser,payload);
} 

// VERIFY SMS OTP API
export const postVerifySmsOtpApi = async (payload:any) => {
  return axios.post(ApiUrls.otpVerify,payload);
} 