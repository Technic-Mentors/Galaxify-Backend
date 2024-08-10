const Products = require("../Schema/products")
const express = require("express")
const router = express.Router()
const multer = require("multer");
const cloudinary = require("../Cloudinary");
const bcrypt = require("bcrypt");
const User = require("../Schema/User");
const Admin = require("../Schema/Admin")
const products = require("../Schema/products");
const Category = require("../Schema/Category")
const Order = require("../Schema/Orders")
const Review = require("../Schema/Review")
const orderDetail = require("../Schema/OrderDetail")
// img storage path
const imgconfig = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`)
    }
});

// img filter
const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true)
    } else {
        callback(new Error("only images is allow"))
    }
}

const upload = multer({
    storage: imgconfig,
    fileFilter: isImage
})

const createAdmin = async () => {
    const adminName = "Galaxify admin"
    const adminEmail = "galaxifymart@gmail.com"
    const adminPassword = "1234"
    const checkEmail = await User.findOne({ email: adminEmail }).maxTimeMS(0)

    if (checkEmail) {
        return;
    }
    const hashPassword = await bcrypt.hash(adminPassword, 10)
    const adminData = await User.create({
        name: adminName,
        email: adminEmail,
        password: hashPassword,
        role: "admin"
    })
    console.log("admin created", adminData)
}
createAdmin()

router.post("/signUp", async (req, res) => {
    try {
        const { name, email, number, password, confirmPassword, role } = req.body
        const checkEmail = await User.findOne({ email }).maxTimeMS(0)

        if (checkEmail) {
            return res.status(400).json({ message: "user with this email already exists" })
        }

        const checkNumber = await User.findOne({ number }).maxTimeMS(0)

        if (checkNumber) {
            return res.status(400).json({ message: "This number already used" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "password does not match" })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            number,
            role,
        })
        res.json(newUser)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

router.post("/signIn", async (req, res) => {
    try {
        const { email, password } = req.body
        const checkEmail = await User.findOne({ email }).maxTimeMS(0)

        if (!checkEmail) {
            return res.status(400).json({ message: "Not found any user with this email" })
        }

        const checkPassword = await bcrypt.compare(password, checkEmail.password)
        if (!checkPassword) {
            return res.status(400).json({ message: "Not found any user with this password" })
        }

        res.json(checkEmail)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

router.get("/allUsers", async (req, res) => {
    try {
        const allUsers = await User.find()
        res.json(allUsers)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

router.get("/User/:id", async (req, res) => {
    try {
        const checkUser = await User.findOne(req.params.id).maxTimeMS(0)

        if (!checkUser) {
            return res.send(400).json({ message: "User with this id not found" })
        }
        res.json(checkUser)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
router.get("/signUser/:id", async (req, res) => {
    try {
        const checkUser = await User.findOne({ _id: req.params.id }).maxTimeMS(0)

        if (!checkUser) {
            return res.send(400).json({ message: "User with this id not found" })
        }
        res.json(checkUser)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
router.put("/UpdateUser/:id", async (req, res) => {
    try {
        const { name, email, number, password, role } = req.body
        const checkUser = await User.findOne({ _id: req.params.id }).maxTimeMS(0)

        if (!checkUser) {
            return res.send(400).json({ message: "User with this id not found" })
        }
        let newUser = {}
        if (name) {
            newUser.name = name
        }
        if (email) {
            newUser.email = email
        }
        if (number) {
            newUser.number = number
        }
        if (password) {
            const hashPassword = await bcrypt.hash(password, 10)
            newUser.password = hashPassword
        }
        if (role) {
            newUser.role = role
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: newUser }, { new: true })
        res.json(updateUser)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

router.delete("/userDelete/:id", async (req, res) => {
    try {
        const delUser = await User.findByIdAndDelete(req.params.id)
        if (!delUser) {
            return res.send(400).json({ message: "User with this id not found" })
        }
        res.json({ message: "user deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

router.post("/addCategory", async (req, res) => {
    try {
        const { category } = req.body
        const checkCategory = await Category.findOne({ category }).maxTimeMS(0)

        if (checkCategory) {
            return res.status(400).json({ message: "Category already exists" })
        }
        const newCategory = await Category.create({ category })
        res.json(newCategory)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
router.get("/allCategories", async (req, res) => {
    try {
        const allCategories = await Category.find()
        res.json(allCategories)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
router.get("/getCat/:id", async (req, res) => {
    try {

        const getCat = await Category.findById(req.params.id)
        if (!getCat) {
            return res.status(400).json({ message: "Category not found against this id" })
        }
        res.json(getCat)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
router.put("/updateCat/:id", async (req, res) => {
    try {
        const { category } = req.body
        const newCate = {}

        if (category) {
            newCate.category = category
        }

        let checkCat = await Category.findById(req.params.id)
        if (!checkCat) {
            return res.status(400).json({ message: "Category not found against this id" })
        }
        checkCat = await Category.findByIdAndUpdate(req.params.id, { $set: newCate }, { new: true })
        res.json(checkCat)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
router.delete("/delcat/:id", async (req, res) => {
    try {
        const cat = await Category.findByIdAndDelete(req.params.id)
        if (!cat) {
            return res.status(400).json({ message: "not found any category against this id" })
        }
        res.json(cat)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
router.post("/addProducts", upload.array("images", 5), async (req, res) => {
    try {
        const { title, price, description, categoryId, userId } = req.body
        const checkTitle = await Products.findOne({ title }).maxTimeMS(0)

        if (checkTitle) {
            return res.status(400).json({ message: "Title already used" })
        }

        let imgs_url = [];
        if (req.files) {
            for (let file of req.files) {
                const upload = await cloudinary.uploader.upload(file.path);
                imgs_url.push(upload.secure_url)
            }
        }
        const newProduct = await Products.create({
            title,
            categoryId,
            userId,
            description,
            images: imgs_url,
            price
        })
        res.json(newProduct)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

router.get("/allProducts", async (req, res) => {
    try {
        const allProducts = await products.find().populate("categoryId", "category").populate("userId", "email")
        res.json(allProducts)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

router.get("/getProdct/:id", async (req, res) => {
    try {
        const ProductId = await Products.findById(req.params.id)
            .populate("categoryId", "category")
        res.json(ProductId)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
router.put("/updateProdct/:id", upload.array("images", 5), async (req, res) => {
    try {
        const { title, price, description, categoryId, imageIndex } = req.body
        const newProduct = {}

        let checkProduct = await Products.findById(req.params.id)
        if (!checkProduct) {
            return res.status(400).json({ message: "product not found against this id" })
        }

        let parsedImageIndex = [];
        if (imageIndex) {
            parsedImageIndex = JSON.parse(imageIndex);
        }

        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                const upload = await cloudinary.uploader.upload(req.files[i].path);
                if (parsedImageIndex[i] !== undefined) {
                    checkProduct.images[parsedImageIndex[i]] = upload.secure_url;
                } else {
                    checkProduct.images.push(upload.secure_url);
                }
            }
        }


        if (title) {
            newProduct.title = title
        }
        if (price) {
            newProduct.price = price
        }
        if (description) {
            newProduct.description = description
        }
        if (categoryId) {
            newProduct.categoryId = categoryId
        }

        checkProduct = await Products.findByIdAndUpdate(req.params.id, {
            $set: {
                ...newProduct,
                images: checkProduct.images
            }
        }, { new: true });

        res.json(checkProduct)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

router.get("/getProduct/:title", async (req, res) => {
    try {
        const titleProduct = await Products.findOne({ title: req.params.title }).maxTimeMS(0)

            .populate("categoryId", "category")
        res.json(titleProduct)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

router.delete("/delProduct/:id", async (req, res) => {
    try {
        const titleProduct = await Products.findByIdAndDelete(req.params.id)
        res.json({ message: "product deleted successfully", titleProduct })
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

const generatOrderNumber = () => {
    const randomNumber = Math.floor(Math.random() * 10000)
    return `ORD-${randomNumber}`
}

router.post("/placeOrder", async (req, res) => {
    try {
        const {
            name,
            country,
            address,
            city,
            postCode,
            number,
            email,
            addInformation,
            orderAmount,
            cartProducts,
            orderStatus
        } = req.body;

        const orderNumber = generatOrderNumber()
        // Create the order
        const placeOrder = await Order.create({
            name,
            country,
            address,
            city,
            postCode,
            number,
            email,
            addInformation,
            orderAmount,
            orderNumber,
            orderStatus
        });

        // Map over each product in the cartProducts array and create orderDetail documents
        const savedProducts = await Promise.all(cartProducts.map(async (product) => {
            const { productId, quantity, subTotal } = product;

            // Create the order detail using the current product's data
            return await orderDetail.create({
                orderId: placeOrder._id,
                subTotal,
                quantity,
                productId
            });
        }));

        res.json({ placeOrder, savedProducts }); // Return both order and saved products as response
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error occurred");
    }
});

router.get("/orderDetail/:orderId", async (req, res) => {
    try {
        const order = await orderDetail.find({ orderId: req.params.orderId })
            .populate("orderId", "name email address date orderNumber orderAmount orderStatus")
            .populate("productId", "title price subTotal")
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order)
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error occurred");
    }
})
router.get("/orders/:id", async (req, res) => {
    try {
        const order = await orderDetail.find({ orderId: req.params.id })
            .populate("orderId", "name email address date orderNumber addInformation orderAmount orderStatus")
            .populate("productId", "title price image description subTotal")
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order)
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error occurred");
    }
})
router.get("/editOrder/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order)
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error occurred");
    }
})
router.put("/updateOrder/:id", async (req, res) => {
    try {
        const { orderStatus } = req.body
        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true })
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order)
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error occurred");
    }
})
router.get("/allOrders", async (req, res) => {
    try {
        const allOrders = await Order.find()
        res.json(allOrders)
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error occurred");
    }
})
router.get("/orderByNumber/:orderNumber", async (req, res) => {
    try {
        const orderNumber = await Order.findOne({ orderNumber: req.params.orderNumber })
        if (!orderNumber) {
            return res.status(400).json({ message: "order not found" })
        }
        res.json(orderNumber)
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error occurred");
    }
})

// review apis
router.post("/addReview", async (req, res) => {
    try {
        const { name, email, review, rating, productId } = req.body
        const addNewReview = await Review.create({
            name,
            email,
            review,
            rating,
            productId
        })
        res.json(addNewReview)
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error occured")

    }
})
router.get("/getReview", async (req, res) => {
    try {
        const allReviews = await Review.find().populate("productId", "title")
        if (!allReviews) {
            return res.status(400).json({ message: "not found any review yet" })
        }
        res.json(allReviews)
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error occured")

    }
})

module.exports = router;