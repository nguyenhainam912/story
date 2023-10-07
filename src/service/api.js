import axios from "../utils/axios-customize";
// authen
export const callRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};

export const callLogin = (username, password) => {
  return axios.post(
    "/api/v1/auth/login",
    { username, password },
    { withCredentials: true }
  );
};

export const callLogout = () => {
  return axios.post("/api/v1/auth/logout");
};

export const callFetchAccount = (token) => {
  return axios.get("/api/v1/auth/account", token);
};

// user
export const callGetListUser = (query) => {
  return axios.get(`/api/v1/user?${query}`);
};

export const callGetListStaff = () => {
  return axios.get(`/api/v1/user/staff`);
};

// export const callGetUserById = (id) => {
//   return axios.get(`/api/v1/user/${id}`);
// };

export const callAddNewUser = (fullName, password, email, phone, address, role) => {
  return axios.post(`/api/v1/user`, { fullName, password, email, phone, address , role});
};

export const callBulkCreateUser = (data) => {
  return axios.post(`/api/v1/user/bulk-create`, data);
};

export const callDeleteUser = (id) => {
  return axios.delete(`/api/v1/user/${id}`);
};

export const updateUser = (_id, fullName, phone, address) => {
  return axios.put(`/api/v1/user`, { _id, fullName, phone, address});
};

// book
export const callGetListBook = (query) => {
  return axios.get(`/api/v1/book?${query}`);
};

export const callAddNewBook = (mainText, category, author, price) => {
  return axios.post(`/api/v1/book`, { mainText, category, author, price });
};

export const callGetBook = () => {
  return axios.get(`/api/v1/book/book`);
};

export const callCategory = () => {
  return axios.get(`api/v1/database/category`);
};

export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);

  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",

      "upload_type": "book",
    },
  });
};

export const callCreateBook = (
  mainText,
  author,
  price,
  sold,
  quantity,
  category,
  thumbnail,
  slider
) => {
  return axios.post(`api/v1/book`, {
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
    thumbnail,
    slider,
  });
};

export const callUpdateBook = (
  _id,
  mainText,
  author,
  category,
  price,
  quantity,
  sold,
  slider,
  thumbnail
) => {
  return axios.put(`api/v1/book/${_id}`, {
    mainText,
    author,
    category,
    price,
    quantity,
    sold,
    slider,
    thumbnail,
  });
};

export const callDeleteBook = (id) => {
  return axios.delete(`api/v1/book/${id}`);
};

export const callGetBookById = (id) => {
  return axios.get(`/api/v1/book/${id}`);
};

export const callGetBookByName = (name) => {
  return axios.get(`/api/v1/book/mainText/${name}`);
};

export const callPlaceOrder = (data) => {
  return axios.post(`/api/v1/order`, { ...data });
};

export const callOrderHistory = () => {
  return axios.get("/api/v1/history");
};

export const callUploadAvatar = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);

  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",

      "upload_type": "avatar",
    },
  });
};
export const callUpdateUserInfo = ({ _id, phone, fullName, avatar }) => {
  return axios.put("/api/v1/user", {
    _id,
    phone,
    fullName,
    avatar,
  });
};

export const callUpdatePassword = (email, oldpass, newpass) => {
  return axios.post("api/v1/user/change-password", {
    email,
    oldpass,
    newpass,
  });
};

export const callListOrder = (query) => {
  return axios.get(`api/v1/order?${query}`);
};

export const callDashBoard = () => {
  return axios.get("api/v1/database/dashboard");
};
