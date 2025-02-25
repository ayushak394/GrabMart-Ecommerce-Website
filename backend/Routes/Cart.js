const express = require("express");
const router = express.Router(); // An instance of express router which allows to define router handlers like /add,/remove etc
const Cart = require("../Models/Cart"); // To connect to mongodb cart

router.post("/add", async (req, res) => {
  // req represents incoming http request(contains information about the request made by client), res represent outgoing http response
  // To add an item to cart
  const { userId, product } = req.body; // the request bod(comes from client side(when user clicks the add button)) must contain userId, product

  try {
    let cart = await Cart.findOne({ userId }); // checks if a cart already exists with the associated userId

    if (!cart) {
      // if cart variable is null or undefined(no cart found)
      cart = new Cart({ userId, items: [] }); // creates a new instance of the Cart model
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === product.productId
    ); // cart.items refers to the items array in the cart object and uses the js function .find to travese through the array and finds if the productid of an item matches the productid being passed.

    if (existingItem) {
      existingItem.quantity += 1; // if the item is found, increment its quantity by 1
    } else {
      cart.items.push({
        productId: product.productId,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
      }); // if it isn't found push it in the array
    }

    await cart.save(); // wait for the updated cart to be saved to the database
    res.status(200).json(cart); // res refers to the response object in express, to send response back to client json(cart) -> 1) json = serializes the cart JavaScript Object into JSON format, 2)cart object contains all the data and is sent to the client.
  } catch (error) {
    // catches any error with in the try block, if error occurs catch block is executed
    res.status(500).json({ error: "Error adding to cart" });
  }
});

router.get("/:userId", async (req, res) => {
  // to get cart items
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "items.productId", // populate is a mongoose method which helps in replacing ObjectId refrences with the corresponding documents from another collection. In our case it will replace productId with the full product details.
      "name image price"
    );
    res.status(200).json(cart ? cart.items : []); // if cart is found it sends a OK status along with list of items, or else returns an empty array
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" }); // catch error and display if any during code execution
  }
});

router.delete("/remove/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params; // extract from the route paramaters

    console.log(req.params);
    const cart = await Cart.findOne({ userId }); // find cart by userId

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" }); // declare message if no cart exists
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString() // if a cart exists filter the items to remove the item with productId extract
    );

    await cart.save(); // save the updated cart to database

    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ error: "Error removing item" });
  }
});

router.put("/update/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ error: "No user cart found." });

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (existingItem.quantity <= 1) {
      return res
        .status(400)
        .json({ message: "Quantity cannot be less than 1" });
    }
    existingItem.quantity -= 1;

    await cart.save();

    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ error: "Error updating item quantity" });
  }
});

module.exports = router; // to access the routers routes in different part of application
