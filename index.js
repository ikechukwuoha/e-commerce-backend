/* -------------------------------------- Import dot env and express file upload -------------------------------------- */
const dotenv = require("dotenv")
dotenv.config()
const fileUpload = require('express-fileupload');
/* ------------------------------------------------ Start express app ------------------------------------------------ */
const express = require("express");
const app = express();
// const ApiRoutes = require('./routes/api');
// const WebRoutes = require('./routes/web');
/* --------------------------------------------- SET DEFAULT MIDDLEWARE --------------------------------------------- */
/* ---------------------------------------------------- JSON POST --------------------------------------------------- */
app.use(express.json());
/* -------------------------------------------------- RECEIVE DATA -------------------------------------------------- */
app.use(express.urlencoded({ extended: false }))

app.use(fileUpload());
/* ---------------------------------- SET-UP STRUCTURE FOR ALSO HANDLING FRONT END ---------------------------------- */
/* ---------------------------------------------- static assets css etc --------------------------------------------- */
app.use(express.static("public"));
/* -------------------------------------- HANDLE FRONT END SYSTEM LIKE HTML etc ------------------------------------- */
app.set('view engine', 'ejs')
/* ---------------------------------------------- ADD CUSTOM MIDDLEWARE --------------------------------------------- */
/* ------------------------------------------------- OTHER IMPORRTS ------------------------------------------------- */
const mongoose = require("mongoose")
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")

/* ------------------------------------------------------------------------------------------------------------------- */
/*                                                MONGOOSE CONFIG                                                      */
/* ------------------------------------------------------------------------------------------------------------------- */
mongoose
    .connect(
        process.env.MONGO_URL
    )
    .then(()=>console.log("DB Connection Successful")).catch((err)=>{
    console.log(err)

});


/* ------------------------------------------------------------------------------------------------------------------- */
/*                                                       ROUTES                                                        */
/* ------------------------------------------------------------------------------------------------------------------- */
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);


/* ------------------------------------------------------------------------------------------------------------------- */
/*                                               EXPRESS SERVER                                                        */
/* ------------------------------------------------------------------------------------------------------------------- */
app.listen(process.env.PORT || 3100, ()=>{
    console.log(`server running on port ${process.env.PORT}`);
})