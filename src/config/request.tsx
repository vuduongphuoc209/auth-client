import axios from "axios";

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const requestGet = async () => {
  const response = await request.get("/");
  return response;
};

export default request;
