const express = require('express');
// const users = require('./users.json');
const mongoose = require('mongoose');
const cors = require('cors');
const usersDb = require('./models/userModel.js');
const adminRouter = require('./routes/adminRoute.js');
const fs = require("fs");
const { authMiddleware } = require('./authMiddleware/auth.js');
const multer = require('multer');
const path = require("path");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
}));

app.use("/admin", adminRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect("mongodb://localhost:27017/matics-project2")
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((error)=>{
    console.log("connection failed--------", error);
  })



// Get All Users (Using DB)
app.get('/getAllUsers',authMiddleware, async (req, res) => {
  try{
    const users = await usersDb.find();
    // console.log("users-----", users);
    res.json(users);
  } catch(error){
    console.log("error-----", error);
    res.status(500).json({message: "error fetching users"}, error)
  }
})

// Get All users by ID

app.get('/users/:id',authMiddleware, async (req,res) => {
  try{
    const { id } = req.params;
    console.log("fetching users id----", id)
    const user = await usersDb.findById(id);
    if(!user){
      return res.status(404).json({message: "user not found"});
    }
    return res.status(200).json(user);
  } catch(err){
    console.error('error fetching user', err);
    return res.status(500).json({message: "error loading users"})
  }
});

// // Get All users by ID (Using JSON FILE)
// app.get('/users', (req, res) => {
//   const { id } =  req.params;
//   console.log("id-----", Number(id));

//   const user = usersDb.find((u) => u.id === Number(id));
//   console.log(user);
//   if(!user){
//     return res.status(400).json({message: "user not found"})
//   } 
//   return res.json(user);
// });

// Delete User by ID (Using DB)

app.delete('/users/:id',authMiddleware, async (req, res) => {
  try{
    const { id } = req.params;
    console.log('id------', Number(id));
    const user = await usersDb.findByIdAndDelete(id);

    if(!user){
      return res.status(500).json({message: "user not found"});
    }
    res.status(200).json({message: "user deleted successfully"});
  } catch(err){
     res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete User by ID
// app.delete('/users/:id', (req, res) => {
//   const { id } = req.params;
//   console.log('id=====', Number(id));
  
//   const filteredUsers = users.filter((user) => user.id !== Number(id));
//   console.log(filteredUsers);
//     fs.writeFile("./users.json", JSON.stringify(filteredUsers), (err) => {
//       // console.log(data);
//       // return res.json(filteredUsers);
//       if(err) {
//         console.error("error: ", err);
//         return res.status(500).json({message: "failed to delete user"});
//       }
//       console.log("user delted successfully");
//       return res.status(200).json(filteredUsers);
//     });
// });

//Add new user

app.post("/users",authMiddleware, async (req, res) =>{
  let { name, age, city } = req.body;
  console.log("req-----", req.body)
  try{
    if( !name || !age || !city ){
      return res.status(400).json({message: "all fields are required"})
    }
    const users = new usersDb ({ name, age, city });
    console.log("users --------", users);
    await users.save();
    res.status(200).json({message: "users added successfully"});
  } catch(err){
    console.error(err);
    res.status(500).json({message: "adding users failed----", err})
  }

  // if(name || age || city){
  //   res.status(500).send({ message: "User Added Successfully" });
  // }
  // let id = Date.now();
  // users.push({id, name, age, city});
  //   fs.writeFile("./users.json", JSON.stringify(users, null, 2), (err) => {
  //     // console.log(data);
  //     // return res.json(filteredUsers);
  //     if(err) {
  //       console.error("error: ", err);
  //       return res.status(500).json({message: "failed to add user"});
  //     }
  //     console.log("user added successfully");
  //     return res.status(200).json(users);
});
// })

// Update User By ID

app.put('/users/:id', authMiddleware, async (req,res) => {
  try{
    const { id } = req.params;
    console.log("params------",id);
    const updatedData = req.body;
    console.log("updatedData-----", updatedData)

    const updatedUser = await usersDb.findByIdAndUpdate(id, updatedData, {new: true});
    console.log("updated data-----", updatedData)
    console.log("updated user-----",updatedUser)
    
    if(!updatedUser){
      console.log("id----" , id)
      return res.status(400).json({message:"user not found"});
    }
    return res.status(200).json({message: "user updated successfully"});
  } catch(err){
    console.error('Error updating item:', err);
    return res.status(500).json({message: "cannot update user---", err})
  }
});


//edit

// app.patch("/users/:id", (req, res) =>{
//   // let id = Number(req.params.id);
//   let { name, age, city } = req.body;
//   const {id} = req.params
//   console.log("id----", req.params, req.body);
//   if(!name || !age || !city){
//     res.status(400).send({ message: "All fields required" });
//   }
//   let index = users.findIndex ( (user) => user.id == id);
//   users.splice(index,1, { ...req.body });
//     fs.writeFile("./users.json", JSON.stringify(users, null, 2), (err) => {
//       // console.log(data);
//       // return res.json(filteredUsers);
//       if(err) {
//         console.error("error: ", err);
//         return res.status(500).json({message: "failed to update user"});
//       }
//       console.log("user updated successfully");
//       return res.status(200).json(users);
//   })
// })


//Multer configure

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, "uploads/");  //upload folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+ "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Upload image for a specific user
app.put("/users/:id/upload", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Save image path (relative to backend)
    const imagePath = `uploads/${req.file.filename}`;

    const updatedUser = await usersDb.findByIdAndUpdate(
      id,
      { image: imagePath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ message: "Error uploading image", error: err.message });
  }
});


//Upload Image POST route

// app.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     const { name } = req.body;
//     const imgPath = req.file ? req.file.path : null;

//     const user = new usersDb({ name, image: imgPath });
//     await user.save();

//     res.status(200).json({ message: "File uploaded successfully", user });
//   } catch(err){
//     res.status(500).json({ error: err.message });
//   }
// })



app.listen(PORT , console.log(`server is running on port ${PORT}`))

