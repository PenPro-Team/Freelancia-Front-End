// this page is -> network/API/AxiosInstance
import axios from "axios";

let url = "http://127.0.0.1:8000";

export const AxiosFreelancersInstance = axios.create({
  baseURL: `${url}/freelancers/`, // Base URL for freelancers
});

export const AxiosClientsInstance = axios.create({
  baseURL: `${url}/clients/`, // Base URL for freelancers
});
/**
 * This Api For Projects
 */
export const AxiosProjectsInstance = axios.create({
  baseURL: `${url}/projects/`,
});

/**
 * This API For Propsals
 */
export const AxiosProposalsInstance = axios.create({
  baseURL: `${url}/proposals/`,
});

// This Api For Skills (HTML,CSS,js,python)
export const AxiosSkillsInstance = axios.create({
  baseURL: `${url}/skills/`,
});

// This Api For PostSkills For Freelancer (HTML,CSS,js,python)
export const AxiosFreelancerSkillsInstance = axios.create({
  baseURL: "https://api-generator.retool.com/HrMfyx/data",
});

export const AxiosLoginInstance = axios.create({
  baseURL: `${url}/auth-token/`,
});

export const AxiosReviewInstance = axios.create({
  baseURL: `${url}/reviews/`,
});

export const AxiosLogOutInstance = axios.create({
  baseURL: `${url}/logout`,
});

export const AxiosRegisterInstance = axios.create({
  baseURL: `${url}/users/`,
});

export const AxiosUserInstance = axios.create({
  baseURL: `${url}/users/`,
});
/**
 * Demo Use it For getting Projects
 * AxiosProjectsInstance.get("What you will add to the url" , {"For Post The opject will be here"}).then().catch()
 */

// Instance If it's needed , For Future Use
// // Add a request interceptor
// AxiosProjectsInstance.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     config["params"] = {
//                             // If there're shared Params
//                          }
//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor
// AxiosProjectsInstance.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
//   },
//   function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );
