import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUserAxios } from '../helper/axiosInstense';
import { registerApi } from '../helper/RouterFIle';


const Registration = () => {
  const [ data, setData ] = useState({ adminname:"", email:"", password:"" });
  const [ msg, setMsg ] = useState("");
  const navigate = useNavigate();

  const handleChange = async(e) => {
    setData({...data, [e.target.name] : e.target.value })
  }

  const validate = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;

    if(!emailRegex.test(data.email)){
      return "email must be a valid gmail address"
    }
    if(!passwordRegex.test(data.password)){
      return "password must have minimum 8 letters and a Alphabet"
    }
    return "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateError = validate();

    if(validateError){
      setMsg(validateError);
      return;
    }
    try{
      console.log('data-----', data);
      const res = await postUserAxios(`admin/${registerApi}`, data);
      console.log("res------", res);
      // const res = await axios.post(`http://localhost:3000/admin/register`, data)
      if(res.status ){
      setMsg("registration successfull")
      navigate('/');
    }
      // console.log(res.data);
    }catch(err){
      setMsg(err.response?.data?.message || "Registration failed.");
      console.error("Error during registration:", err);
    }
  }

  return (
    <div className='flex flex-col items-center mt-5'>
      <h2 className='font-semibold text-2xl'>Registration Form</h2>
      <div className='flex flex-col items-center'>
        <input name="adminname" type="text" value={data.adminname} placeholder='enter adminname' onChange={handleChange} required 
        className='border border-gray-400 p-3 w-80 mt-10 placeholder-gray-300' /> <br />
        <input name="email" type="email" value={data.email} placeholder='enter email' onChange={handleChange} required 
        className='border border-gray-400 p-3 w-80 placeholder-gray-300'/> <br />
        <input name="password" type="password" value={data.password}  placeholder='enter password' onChange={handleChange} required 
        className='border border-gray-400 p-3 w-80 placeholder-gray-300'/> <br />
        <div className="flex flex-col items-center">
          <button onClick={handleSubmit}
            className="border py-3 w-20 mt-2 cursor-pointer hover:bg-black hover:text-white transition-all duration-300"
          >
           Register
          </button>

          <div className='flex gap-2 mt-2'>
            <p className=''>already an admin ? </p>
            <p className='cursor-pointer' onClick={ () => navigate('/')}>login</p>
          </div>
        </div>
        <p className='mt-'>{msg}</p>
      </div>
    </div>
  )
}

export default Registration;
