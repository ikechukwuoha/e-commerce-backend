const router = require("express").Router();
const User = require("../models/User")

//REGISTER
router.post("/register", async (req, res) => {
    const {username, email, password} = req.body

    if (!username) {
        return res.status(400).json({error: "The Username Field is reqired"})
    }

    if (!email) {
        return res.status(400).json({error: "The email Field is reqired"})
    }

    if (!password) {
        return res.status(400).json({error: "The password Field is reqired"})
    }

    let re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!re.test(email)) {
        return res.status(400).json({ error: "Invalid email format...." });
    }

    const newUser = new User({
        username,
        email,
        password,
    });

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    }catch(err){
        res.status(500).json(err);
    }   
});


module.exports = router
