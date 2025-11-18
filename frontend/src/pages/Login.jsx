import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../helper/RouterFIle';
import { postUserAxios } from '../helper/axiosInstense';

const Login = () => {
  const [ data, setData ] = useState({ email:"", password:"" });
  const [ msg, setMsg ] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      console.log('data-----', data);
      const res = await postUserAxios(`admin${loginApi}`, data);
      // const res = await axios.post("http://localhost:3000/admin/login", data);
      console.log("res-----", res.data);
      if(res?.message === "login successful"){
        setMsg("Login Successful");
        localStorage.setItem('token', res.token);
        navigate('/userdetail');
      } 
      else{
        setMsg(res?.message || "Login Failed")
      }
    } catch(err){
      console.log("Login error-------", err);
      setMsg("Login Failed")      
    }
  };

  return (
    <div className='mt-5 flex flex-col items-center '>
      <h1 className='font-semibold text-2xl'>Admin Login</h1>
      <form className='mt-5'>
        <input 
          name='email' 
          type='email' 
          onChange={handleChange}
          value={data.email}
          placeholder='Enter email' 
          className='border border-gray-400 p-3 w-80 mt-3 placeholder-gray-300'
        /> 
        <br />       
        <input 
          name='password' 
          type='password'  
          onChange={handleChange}
          value={data.password}
          placeholder='Enter password' 
          className='border border-gray-400 p-3 w-80 mt-3 placeholder-gray-300'
        /> 
        <br />
      </form>
      <div>
        <button className='border py-3 w-20 mt-5 cursor-pointer hover:bg-black hover:text-white transition-all duration-300'
        onClick={handleSubmit}>
          Login
        </button>
      </div>
      <p className='mt-3 text-red-500'>{msg}</p>

      <div className=''>
        <p>Don't have an account?</p>
        <p 
          onClick={() => navigate('/registration')} 
          className='cursor-pointer text-blue-500 hover:underline'
        >
          Register here
        </p>
      </div>
    </div>
  )
}

export default Login
