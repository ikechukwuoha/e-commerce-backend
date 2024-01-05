const dotenv = require("dotenv")
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")


dotenv.config()



mongoose
    .connect(
        process.env.MONGO_URL
    )
    .then(()=>console.log("DB Connection Successful")).catch((err)=>{
    console.log(err)

});

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.listen(process.env.PORT || 3100, ()=>{
    console.log(`server running on port ${process.env.PORT}`);
})