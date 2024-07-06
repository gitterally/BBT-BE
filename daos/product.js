
const mongoose = require("mongoose");
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

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

  module.exports = mongoose.model("User", userSchema);
