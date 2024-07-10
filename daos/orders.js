const mongoose = require("mongoose");
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    sugar: {
      type: String,
      enum: ["none", "normal", "honey", "stevia"],
      required: true,
      default: "stevia",
    },
    
    sugarLevel: {
      type: String,
      enum: ["0%", "25%", "50%","75%","100%"],
      required: true,
      default: "0%",
    },
    iceLevel: {
      type: String,
      enum: ["normal", "less","little","none"],
      required: true,
      default: "normal",
    },
    content: {
      type: String,
      required: false,
      default:"",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);



const drinkSchema = new Schema(
  {
    mainProduct: {
      type: Schema.Types.Mixed, // Allow both ObjectId and String
      required: true,
      ref: "Product"
    },
    toppings: [{
      topping: {
        type: Schema.Types.Mixed, // Allow both ObjectId and String
        required: true,
        ref: "Product"
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      }
    }],
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    comment: [commentSchema],
  },
  {
    _id: false,
    timestamps: false,
  }
);



const orderSchema = new Schema(
  {
    orderID: {
      type: String,
      required: true,
    },
    drinks: [drinkSchema],
    total: {
      type: Number,
      required: true,
      default: 0,  // Set a default value
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    expire_at: {
      type: Number,
    },
    is_paid: {
      type: Boolean,
      default: true,
    },
    // comment:[commentSchema],
  },
  {
    timestamps: true,
  }
);


// Pre-save hook for calculating total price and resolving names to ObjectIds
orderSchema.pre('save', async function (next) {
  try {
    let total = 0;

    for (let drink of this.drinks) {
      let mainProduct;
      if (typeof drink.mainProduct === 'string') {
        mainProduct = await mongoose.model('Product').findOne({ name: drink.mainProduct });
        if (!mainProduct) {
          throw new Error(`Main product not found: ${drink.mainProduct}`);
        }
        drink.mainProduct = mainProduct._id;
      } else {
        mainProduct = await mongoose.model('Product').findById(drink.mainProduct);
        if (!mainProduct) {
          throw new Error(`Main product not found with id: ${drink.mainProduct}`);
        }
      }

      // if (mainProduct.type !== 'mainProduct') {
      //   throw new Error(`Product specified as main product is not of type 'mainProduct': ${mainProduct.name}`);
      // }

      total += mainProduct.price * drink.quantity;

      for (let toppingItem of drink.toppings) {
        let topping;
        if (typeof toppingItem.topping === 'string') {
          topping = await mongoose.model('Product').findOne({ name: toppingItem.topping });
          if (!topping) {
            throw new Error(`Topping not found: ${toppingItem.topping}`);
          }
          toppingItem.topping = topping._id;
        } else {
          topping = await mongoose.model('Product').findById(toppingItem.topping);
          if (!topping) {
            throw new Error(`Topping not found with id: ${toppingItem.topping}`);
          }
        }

        // if (topping.type !== 'topping') {
        //   throw new Error(`Product specified as topping is not of type 'topping': ${topping.name}`);
        // }

        total += topping.price * toppingItem.quantity * drink.quantity;
      }
    }

    this.total = total;  // Set the calculated total
    next();
  } catch (err) {
    next(err);
  }
});

// Compile the schema into a model and export it
// highlight-next-line
module.exports = mongoose.model("Order", orderSchema);
