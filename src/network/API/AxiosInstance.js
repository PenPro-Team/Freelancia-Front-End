// this page is -> network/API/AxiosInstance
import axios from "axios";
import { getFromLocalStorage } from "../local/LocalStorage";

let url = "http://127.0.0.1:8000";

export const AxiosFreelancersGetPortfolios = axios.create({
  baseURL: `${url}/portfolios/?user=`, // API for GET Portfolios for freelancers
});

export const AxiosFreelancersPortfolios = axios.create({
  baseURL: `${url}/portfolios/`, // API for Post Portfolios for freelancers
});

export const AxiosFreelancersCertificate = axios.create({
  baseURL: `${url}/certificates/`, // API for Post and Get Certificate for freelancers
});

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

// this is api for paypal payment
export const AxiosPayPalInstance = axios.create({
  baseURL: `${url}/payments/paypal/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// this is an api call to confirm Auth
export const AxiosConfirmAuthInstance = axios.create({
  baseURL: `${url}/api/token/`,
});

// this is an api for withdrawals
export const AxiosWithdrawalsInstance = axios.create({
  baseURL: `${url}/api/payments/withdrawals/`,
});

/**
 * This API For Propsals
 */
export const AxiosProposalsInstance = axios.create({
  baseURL: `${url}/proposals/`,
});

// This Api For Skills (HTML,CSS,js,python) --> For Get Skills
export const AxiosSkillsInstance = axios.create({
  baseURL: `${url}/skills/`,
});

// This Api For Skills (HTML,CSS,js,python) --> For Post Skill
export const AxiosPostSkillsInstance = axios.create({
  baseURL: `${url}/skill/`,
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

export const AxiosUserInstance = axios.create({
  baseURL: `${url}/users/`,
});
export const BASE_PATH = "/Freelancia-Front-End";

export const AxiosContractsInstance = axios.create({
  baseURL: `${url}/contract/`,
});

export const AxiosReportInstance = axios.create({
  baseURL: `${url}/reports/`,
});

export const AxiosContactInstance = axios.create({
  baseURL: `${url}/contactus/`,
});

export const AxiosWSAuthInstance = axios.create({
  baseURL: `${url}/auth_for_ws_connection/`,
});

export const AxiosChatInstance = axios.create({
  baseURL: `${url}/chat/`,
});

export const AxiosUserSearchInstance = axios.create({
  baseURL: `${url}/users/search/`,
});