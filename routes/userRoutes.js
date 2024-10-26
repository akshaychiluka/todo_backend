const express =require("express")
const {PrismaClient}=require('@prisma/client');
const prisma = new PrismaClient();

const router=express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key"; 


async function insert_user(user_name,password,full_name)
{

    try{
    const pass=await bcrypt.hash(password,10)
    const new_user=await prisma.user_table.create({
        data:{
            user_name,
            password:pass,
            full_name
        },
    });
    return {success:true,user:new_user};
    }
    catch(error){
        console.log("error to creat user",error.message)
        return {success:false,error:"Failed to connect"};
    }
}

router.get("/user",authenticateToken,async function(req,res){
    const ID=req.user.user_id;
    console.log(ID)
    try{
        const user = await prisma.user_table.findUnique({
            where: { id: ID },
        });
        res.status(201).json(user);
    }
    catch(error){
        res.status(500).json({
            error: "error in fetching details"
        })
    }  
})

router.post("/singup",async function(req,res){
    const user_name = req.body.user;  // Get the username from the request body  
    const password = req.body.pass;
    const full_name=req.body.name;

    try {
        
        const insert = await insert_user(user_name,password,full_name); // Use the user's ID

        if (insert.success) {
            res.status(201).json({
                message: "user created successfully",
                user: insert.user
            });
        } else {
            res.status(500).json({
                message: "Failed to create todo",
                error: insert.error // Send the error message
            });
        }
    } catch (error) {
        console.error("Error processing user request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})
router.delete("/user",async (req,res)=>{
    const user_name=req.body.user;
    try{
        const user = await prisma.user_table.findUnique({
            where: { user_name: user_name },
        });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const delete_todo=await prisma .todo_table.deleteMany({
            where:{
                user_id:user.id
            }
        })
        
        const delete_user=await prisma.user_table.delete({
            where:{
                user_name:user_name
            }
        })
        res.json({
            message:"User deleted sucessfully",
            user:delete_user,
            todo:delete_todo
        })
    }catch(error){
        console.log('Error deleting user:', error.message);
        if(error.code=='p2025'){
            res.status(404).json({
                error:"User not found"
            })
        }
        else{
            res.status(500).json({
                error:"error while deleting the user"
            })
        }
    }
})
router.post("/signin",async(req,res)=>{
    const {user,pass}=req.body;
    try{
        const user_existing=await prisma.user_table.findUnique({
            where:{
                user_name:user
            }
        })
        if(!user||!(await bcrypt.compare(pass,user_existing.password)))
        {
            res.status(401).json({error:"Invalid username or password"})
        }
        const token=jwt.sign({user_id:user_existing.id},secretKey)
        res.json({message:"login sucessful",token})
    }
    catch(error){
        console.error("Login error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
})

function authenticateToken(req,res,next){
    const token=req.headers["autherization"];
    jwt.verify(token,secretKey,(err,user)=>{
        if(err){
            return  res.status(403).json({ error: "Invalid token" });
        }
        req.user=user;
        next();
    });
}

module.exports = {router,authenticateToken};
