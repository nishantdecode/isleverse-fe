import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_ENV === "PROD"
    ? process.env.NEXT_PUBLIC_API_PROD
    : process.env.NEXT_PUBLIC_API_DEV;

const headerData = () => {
  let token = null;

  // Check if the token exists in localStorage
  if (typeof window !== "undefined" && window.localStorage) {
    token = localStorage.getItem("accessToken");
  }

  return {
    "Access-Control-Allow-Origin": "*",
    Authorization: token ? `Bearer ${JSON.parse(token)}` : undefined, // Attach the Bearer token
  };
};

const instance = axios.create({
  timeout: 30000,
  headers: headerData(),
});

const responseBody = (response) => {
  return response;
};

const errorBody = (err) => {
  if (err.code === "ERR_NETWORK") {
    return {
      message: "Please check internet connectivity, then retry!",
      status: 501,
    };
  } else if (err.code === "ERR_BAD_RESPONSE") {
    if (err.response.data.code) {
      return {
        message: "Please contact support, issue in server",
        status: 501,
      };
    } else if (err.response.data.message) {
      return {
        message: err.response.data.message,
        status: err.response.data.status,
      };
    } else {
      return {
        message: "Please contact support, something wrong with server",
        status: 501,
      };
    }
  } else if (err.code === "ERR_BAD_REQUEST") {
    if (err.response.data.message) {
      return {
        message:
          typeof err.response.data.message === `string`
            ? err.response.data.message
            : JSON.stringify(err.response.data.message),
        status: err.response.data.status,
      };
    } else if (typeof err.response.data === "string") {
      return {
        message: err.response.data,
        status: err.response.status,
      };
    } else {
      return {
        message: "Oops, Something went wrong!",
        status: err.response.status,
      };
    }
  }
};

const request = {
  get: (url, headers = { ...headerData() }) =>
    instance.get(url, { headers }).then(responseBody).catch(errorBody),
  post: (url, body, headers = { ...headerData() }) =>
    instance.post(url, body, { headers }).then(responseBody).catch(errorBody),
  put: (url, body, headers = { ...headerData() }) =>
    instance.put(url, body, { headers }).then(responseBody).catch(errorBody),
  delete: (url, headers = { ...headerData() }) =>
    instance.delete(url, { headers }).then(responseBody).catch(errorBody),
};

export const USER = {
  register: (payload) => request.post(`${BASE_URL + "user/"}`, payload),
  login: (payload) => request.post(`${BASE_URL + "user/login"}`, payload),
  verify: () => request.get(`${BASE_URL + "user/verify"}`, headerData()),  // Attach the token
};

// export const ADVERTISEMENTS = {
//   add: (payload) => request.post(`${BASE_URL + "advertisements"}/`, payload),
//   getAll: (query) => request.get(`${BASE_URL + "advertisements/get"}?${query}`),
//   getById: (id) => request.get(`${BASE_URL + "advertisements"}/${id}`),
//   getByTitle: (filterData) =>
//     request.get(`${BASE_URL + "advertisements/title"}`, filterData),
//   update: (id, payload) =>
//     request.put(`${BASE_URL + "advertisements/update"}/${id}`, payload),
//   delete: (id) => request.delete(`${BASE_URL + "advertisements/delete"}/${id}`),
// };
