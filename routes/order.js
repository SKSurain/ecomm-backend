const router = require("express").Router();
const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")

//Create
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    }
    catch (err) {
        res.status(500).json(err)
    }
})


//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updateOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updateOrder)

    } catch (err) {
        res.status(500).json(err);
    }
});


//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted")
    } catch {
        res.status(500).json(err)
    }
})

//GET USER ORDER
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.find({ userId: req.params.userId });
        res.status(200).json(order)
    } catch {
        res.status(500).json(err)
    }
})


//GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json(err)
    }
})


//Get MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    try {
        const productId = req.query.pid;
        console.log("productId")
        const date = new Date();
        const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
        const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

        const income = await Order.aggregate([
            { $unwind: "$products" },
            { $match: { createdAt: { $gte: previousMonth }, ...(productId && { products: { $elemMatch: { productId } }, }), }, },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                }
            }, {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json(income)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router; 