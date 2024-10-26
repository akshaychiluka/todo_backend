const express =require("express")

const { router: userRouter, authenticateToken } = require("./routes/userRoutes");
const todoRoutes=require("./routes/todoRoutes");

const app=express()

app.use(express.json())
app.use("/users",userRouter);
app.use("/todo",todoRoutes)



app.listen(3000)