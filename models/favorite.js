const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish"
    }
  ]
});

const Favorites = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorites;
