import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { toast } from "react-toastify";
import { deleteUserAxios, getUserAxios, postUserAxios, putUserAxios } from '../helper/axiosInstense'
import { getAllUsersApi } from '../helper/RouterFIle'
// import { updateApi } from '../helper/RouterFIle'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const UserDetail = () => {

  const [users , setUsers] = useState([]);
  const [filterUsers , setFilterUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [addOpen, setaddOpen ] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city:""})

  const navigate = useNavigate();
  
 
  const handleaddOpen = () => setaddOpen(true);
  const handleaddClose = () => setaddOpen(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setaddOpen(false); getAllUsers() };
 
  const token = localStorage.getItem('token');

  const getAllUsers = async () => {
    try{
      const res = await getUserAxios(`${getAllUsersApi}`)
      // const res = await axios.get("http://localhost:3000/getAllUsers", {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     'Content-Type' : 'application/json',
      //   }
      // });
      console.log('res.data?.data----', res.data?.data);   
      setUsers(res);  
      setFilterUsers(res); 
    } catch(err){
        if(err.response && err.response.status === 403){
          toast.error("session expired please login again", {
            position : 'top-center'
          });
          localStorage.removeItem('token');
          navigate('/');
        }
      console.log("error fetching details-----", err);
    }
    //.then
    // ((res) => {
    //   console.log(res.data);
    //   setUsers(res.data);
    //   setFilterUsers(res.data);
    // });
  };
  useEffect(() => {
    getAllUsers();
    // const token = localStorage.getItem('token'); 
    if(!token){
      return navigate('/');
    }   
    console.log(localStorage.getItem('token'));
  },[])

  // Search Functionality
  const handleSearch = (e) => {
   const searchText = e.target.value.toLowerCase();
   const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText) ||
    user.city.toLowerCase().includes(searchText) ||
    user.age.toString().includes(searchText)
   );
   setFilterUsers(filteredUsers);
  }

  // Delete Functionality
  const handleDelete = async (id) => {
    console.log("id-----", id)
    try{
      const res = await deleteUserAxios(`users/${id}`)
      // await axios.delete(`http://localhost:3000/users/${id}`, {
      //   headers: {
      //     Authorization : `Bearer ${token}`,
      //     'Content-Type' : 'application/json'
      //   }
      // })
      setUsers((prev) => prev.filter((user) => user._id !== id));
      getAllUsers();
    } catch(err){
      if(err.response && err.response.status === 403){
        toast.error("session expired please login again",{
          position : 'top-center'
        });
        localStorage.removeItem('token');
        navigate('/');        
      }
      console.log("error deleting user", err)
    }
    // await axios.delete(`http://localhost:3000/users/${id}`).then
    // ((res) => {
    //   setUsers(res.data);
    //   setFilterUsers(res.data);
    // })
  };

  //Add User Details

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await postUserAxios(`/users`, userData)
      // const res = await axios.post(`http://localhost:3000/users`, userData, {
      //   headers: {
      //     Authorization : `Bearer ${token}`,
      //     'Content-Type' : 'application/json'
      //   }
      // });
      console.log("add user data-----", userData)
      console.log("user added successfully", res.userData);
      handleaddClose();
      getAllUsers();
    } catch(err){
      if(err.response && err.response.status === 403){
        toast.error("session expired please login again",{
          position : 'top-center'
        });
        localStorage.removeItem('token');
        navigate('/');        
      }
      console.log("error--------", err);
    }
  }

  const handleUpdate = async () => {
    try{
      const id = userData._id;
      console.log("Uid-------", id);
      if(!id){
        console.log("no users found to update");
      }
        const res = await putUserAxios(`users/${id}`, userData)
      // await axios.put(`http://localhost:3000/users/${id}`, userData, {
        // headers: {
        //   Authorization : `Bearer ${token}`,
        //   'Content-Type' : 'application/json'
        // }
        console.log("user data------", userData);
        setUsers((prev) => prev.map((user) => user._id === id ? {...users, ...userData}: user))
        handleClose();
        setUserData({name:"", age:"", city:""});
        getAllUsers();
    } catch(err){
        if(err.response && err.response.status === 403){
          toast.error("session expired please login again", {
            position : 'top-center'
          });
          localStorage.removeItem('token');
          navigate('/');
        }      
      console.log("update user error---", err);
    }
  }
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("data-----", userData)
  //   if (userData.id){
  //     await axios.patch(`http://localhost:3000/users/${userData.id}` ,userData).then((res) => {
  //       console.log(res);
  //       handleClose();
  //     });
  //   } 
  //   else {
  //     await axios.post(`http://localhost:3000/users`, userData).then((res) => {
  //       console.log(res);
  //     });
  //   }
  //   handleClose();
  //   setUserData({ name: "", age: "", city:""});
  // }

  //update user

  // Open edit modal & load selected user
  const handleEdit = async(user) => {
    console.log('selected user to---------', user);
    setUserData(user)
    setOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col gap-4 p-4 items-center'>
        <h1>USERS DETAILS</h1>
        <div className='flex gap-4'>
          <input type="search" placeholder="Search" 
          className='border border-[#ccc] p-2'
          onChange={handleSearch}/>
          <button className='border p-2' onClick={handleaddOpen}>Add Users</button>
        </div>
      </div>

        <table className='border border-[#ccc]'>
          <thead>
            <tr>
              <th className='border border-[#ccc] p-2'>S-no</th>
              <th className='border border-[#ccc] p-2'>Name</th>
              <th className='border border-[#ccc] p-2'>Age</th>
              <th className='border border-[#ccc] p-2'>City</th>
              <th className='border border-[#ccc] p-2'>Edit</th>
              <th className='border border-[#ccc] p-2'>Delete</th>
              <th className='border border-[#ccc] p-2'>View</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers.map((user, index) => (
              <tr key={user._id}>
                <td className='border border-[#ccc] p-2'>{index + 1}</td>
                <td className='border border-[#ccc] p-2'>{user.name}</td>
                <td className='border border-[#ccc] p-2'>{user.age}</td>
                <td className='border border-[#ccc] p-2'>{user.city}</td>
                <td className='border border-[#ccc] p-2'>
                  <button className='border p-1 cursor-pointer' onClick={()=>handleEdit(user)} >Edit</button>
                </td>
                <td className='border border-[#ccc] p-2'>
                  <button className='border p-1 cursor-pointer' onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
                <td className='border border-[#ccc] p-2'>
                  <button className='border p-1 cursor-pointer' onClick={() => navigate(`/view/${user._id}`)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='mt-3 flex items-center'>    
          <button className='border p-2 cursor-pointer' onClick={handleLogout}>Logout</button>
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit User Details
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }} className='space-y-5'>
              <input type='text'  placeholder='enter name' id='name' className='border p-2' value={userData.name} onChange={handleChange}></input>
              <input type='number' placeholder='enter age' id='age'  className='border p-2' value={userData.age} onChange={handleChange}></input>
              <input type='city' placeholder='enter city' id='city'  className='border p-2' value={userData.city} onChange={handleChange}></input> <br/>
              <button className='border p-2' onClick={handleUpdate}>Update</button>
            </Typography>
          </Box>
        </Modal>

        <Modal
          open={addOpen}
          onClose={handleaddClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add User Details
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }} className='space-y-5'>
              <input type='text' value={userData.name} placeholder='enter name' id='name' className='border p-2' onChange={handleChange}></input>
              <input type='number' placeholder='enter age' id='age'  value={userData.age}className='border p-2' onChange={handleChange}></input>
              <input type='city' placeholder='enter city' id='city' value={userData.city} className='border p-2' onChange={handleChange}></input> <br/>
              <button className='border p-2' onClick={handleSubmit}>Submit</button>
            </Typography>
          </Box>
        </Modal>

    </div>
  )
};

export default UserDetail;