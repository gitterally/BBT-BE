const mongoose = require("mongoose");
// optional shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    sugar: {
      type: String,
      enum: ["none", "normal", "honey", "stevia"],
      required: true,
    },
    
    sugarLevel: {
      type: String,
      enum: ["25%", "50%","75%","100%"],
      required: true,
    },
    iceLevel: {
      type: String,
      enum: ["normal", "less","little","none"],
      required: true,
    },
    content: {
      type: String,
      required: true,
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

const orderSchema = new Schema(
  {
    order: {
      type: String,
      required: true,
    },
    created_at: {
      type: Number,
    },
    expire_at: {
      type: Number,
    },
    is_cancelled: {
      type: Boolean,
      default: false,
    },
    is_done: {
      type: Boolean,
      default: false,
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
