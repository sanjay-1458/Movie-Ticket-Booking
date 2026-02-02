import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: String,
      ref: "Movie",
      required: true,
    },
    showDateTime: {
      type: Date,
      required: true,
    },
    showPrice: {
      type: Number,
      required: true,
    },
  },
  { minimize: false }
);

const Show = mongoose.model("Show", showSchema);

export default Show;
