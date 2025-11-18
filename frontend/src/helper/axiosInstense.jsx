import axios from 'axios'
import React from 'react'

const API_BASE_URL = "http://localhost:3000/";

const axiosInstense = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
// ✅ Automatically attach token from sessionStorage
axiosInstense.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // ⬅️ USE sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('config----', config);
    
    return config;
  },
  error => Promise.reject(error)
);

export const getUserAxios = async(router, userData) => {
  try{
    const res = await axiosInstense.get(router, userData);
    console.log('res-------', res.data);
    return res.data;
  } catch (err){
    console.log('error----', err.response?.data || err.message);
    return error.response?.data || { message: "Request failed", status: false };     
  }
}


export const postUserAxios = async (router, userData) => {
  try {
  const response = await axiosInstense.post(router, userData); // Adjust the route to match your backend
  console.log('response-----', response.data);
  return response.data;
  

  } catch (error) {
    console.log('error----', error.response?.data || error.message);
    return error.response?.data || { message: "Request failed", status: false };  }
 
};

export const putUserAxios = async (router, userData) => {
  try{
    const response = await axiosInstense.put(router, userData);
    console.log("response-------", response.data);
    return response.data;
  } catch(error) {
    console.log('error-----', error.response?.data || error.message);
    return error.response?.data || {message: "request failed", status: false};
  }
}

export const deleteUserAxios = async (router, userData) => {
  try{
    const response = await axiosInstense.delete(router, userData);
    console.log("response------", response);
    return response.data;
  } catch(err){
    console.log('error----', err.response.data || err.message );
    return err.response?.data || {message: "request failed", status: false};
  }
}


