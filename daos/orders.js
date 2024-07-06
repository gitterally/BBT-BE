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
      enum: ["25%", "50%","75%","100%"],
      required: true,
      default: "50%",
    },
    iceLevel: {
      type: String,
      enum: ["normal", "less","little","none"],
      required: true,
      default: "normal",
    },
    content: {
      type: String,
      required: true,
      default:" ",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Subdocument schema for toppings with quantity
const toppingSchema = new Schema(
  {
    topping: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    _id: false,
    timestamps: false,
  }
);

// Subdocument schema for drinks including toppings
const drinkSchema = new Schema(
  {
    mainProduct: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    toppings: [toppingSchema],
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
    // drinks: [drinkSchema],
    total: {
      type: Number,
      required: true,
    },
    // customer: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    // },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    created_at: {
      type: Number,
    },
    expire_at: {
      type: Number,
    },
    is_paid: {
      type: Boolean,
      default: true,
    },
    comment:[commentSchema],
  },
  {
    timestamps: true,
  }
);

// Compile the schema into a model and export it
// highlight-next-line
module.exports = mongoose.model("Order", orderSchema);
