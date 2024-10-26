const express =require("express")
const {PrismaClient}=require('@prisma/client');
const prisma = new PrismaClient();
const {authenticateToken}=require("./userRoutes");

const router=express.Router();
async function insert_todo(descrption,user_id)
{
    try{
        const new_todo = await prisma.todo_table.create({
            data: {
                descrption,  // Use the passed description
                user_id
            },
        });
        return { success: true, todo: new_todo };
    }
    catch(error){
        console.log("error to creat todo",error.message)
        return {success:false,error:"Failed to connect"};
    }
}
async function put_todo(descrption,user_id)
{
    const todo =await prisma.todo_table.findFirst({
        where:{
            user_id:user_id,
            descrption:descrption
        }
    })
    if(!todo){
        return res.status(404).json({error:"not found"})
    }
    try{
        const update_todo = await prisma.todo_table.update({
            where:{
                id:todo.id,
            },
            data:{
                done:true
            }
        });
        return { success: true, todo: update_todo };
    }
    catch(error){
        console.log("error to update todo",error.message)
        return {success:false,error:"Failed to connect"};
    }
}
router.get("/todo",authenticateToken,async (req,res)=>{
    const user = req.user;
    try{
    const todo=await prisma.todo_table.findMany({
        where:{
            user_id:user.user_id
        }
    })
    res.json(todo);
    }
    catch(error)
    {
        res.status(402).json({
            message:"error"
        })
    }
})
router.post("/todo",authenticateToken,async function(req,res){
    const user = req.user;  // Get the username from the request body  
    const description = req.body.descrption; // Corrected field name

    try {
        
        const insert = await insert_todo(description, user.user_id); // Use the user's ID

        if (insert.success) {
            res.status(201).json({
                message: "Todo created successfully",
                todo: insert.todo
            });
        } else {
            res.status(500).json({
                message: "Failed to create todo",
                error: insert.error // Send the error message
            });
        }
    } catch (error) {
        console.error("Error processing todo request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.put("/todo",authenticateToken,async function(req,res){
    const user = req.user;
    const description = req.body.descrption; // Corrected field name

    try {
        const insert = await put_todo(description, user.id); // Use the user's ID

        if (insert.success) {
            res.status(201).json({
                message: "Todo updated successfully",
                todo: insert.todo
            });
        } else {
            res.status(500).json({
                message: "Failed to update todo",
                error: insert.error // Send the error message
            });
        }
    } catch (error) {
        console.error("Error processing todo request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;



