const mongoose = require("mongoose");
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    iterations: {
      type: Number,
      required: true,
    },
    token: {
      type: String,
    },
    expire_at: {
      type: Number,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    productComponents: [
      {
        componentName: {
          type: String,
          required: true,
        },
        componentPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    productToppings: [
      {
        toppingName: {
          type: String,
          required: true,
        },
        ctoppingPrice: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
// Compile the schema into a model and export it
// highlight-next-line
module.exports = mongoose.model("User", userSchema);
