const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();




//CREATE
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE ROUTE
router.put("/update-order/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE ROUTE
router.delete("/delete-order/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order Deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ORDER ROUTE
router.get(
  "/get-order/:userId",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.params.userId });

      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// //GET ALL P

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});


//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  let { startDate, endDate } = req.query;

  // If startDate or endDate is not provided, use default values (or handle error as needed)
  if (!startDate || !endDate) {
    startDate = '2022-12-01T00:00:00Z'; // Default start date (December 2022)
    endDate = '2024-01-31T23:59:59Z'; // Default end date (January 2024)
  }

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } // Filter orders within the specified date range
        }
      },
      {
        $project: {
          year: { $year: "$createdAt" }, // Extract the year from createdAt
          month: { $month: "$createdAt" }, // Extract the month from createdAt
          sales: "$amount"
        }
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" }, // Group by year and month
          total: { $sum: "$sales" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
      }
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});






module.exports = router;
