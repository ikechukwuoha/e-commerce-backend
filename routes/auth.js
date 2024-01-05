const CryptoJs = require("crypto-js");
const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");


//REGISTER
router.post("/register", async (req, res) => {
    const {username, email, password} = req.body

    if (!username || !email || !password) {
        return res.status(400).json({error: "username, email, password are reqired"})
    }


    let re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!re.test(email)) {
        return res.status(400).json({ error: "Invalid email format...." });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Password must contain at least one uppercase letter, one lowercase letter, one special character, one digit, and be at least 8 characters long." });
    }

    
    try {
    const newUser = new User({
        username,
        email,
        password: CryptoJs.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC
        ).toString(),
    });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    }   catch(err){
        res.status(500).json(err);
    }   
});


// LOGIN ROUTE
router.post("/login", async (req, res)=> {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(401).json("Invalid credentials");
        }

        const hashedPassword = CryptoJs.AES.decrypt(
            user.password, 
            process.env.PASS_SEC
        );
        const password1 = hashedPassword.toString(CryptoJs.enc.Utf8);
        
        if (password1 !== req.body.password) {
            return res.status(401).json("Invalid Credentials");
            
        }

        const accessToken = jwt.sign({
            id:user._id,
            isAdmin: user.isAdmin,
        }, 
        process.env.JWT_SEC,
        {expiresIn: "6000s"}
        );

        const { password, ...others } = user._doc;
            
        res.status(200).json({...others, accessToken});

    } catch(err){
        res.status(500).json(err);
    }
})


module.exports = router
