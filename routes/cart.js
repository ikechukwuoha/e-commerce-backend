const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE 
router.post("/", verifyToken, async(req, res) => {
    const newCart = new Cart (req.body)
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    }catch(err){
      res.status(500).json(err);
    }
});


//UPDATE ROUTE
router.put("/update-cart/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);


//DELETE ROUTE
router.delete(
  "/delete-cart/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Item Removed from Cart successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//GET CART ROUTE
router.get("/get-cart/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({userId: req.params.userId});

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});


// //GET ALL P

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
    }
});



module.exports = router;