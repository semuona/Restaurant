const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  company: String,
  title: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  },
  location: {
    city: String,
    lat: Number,
    lng: Number,

  },
  salary: String,
  date: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
  },
  contacts: [],
  toDoList: [
    {
      completed: Boolean,
      text: String,
      date: {
        type: Date,
        default: Date.now(),
      },
      id: String,
    }
  ],
  notes: [],
  favorites: Boolean,
  color: String,
  reminder: Boolean,
  coverLetter: String,
  
});
postSchema.index({ "$**": "text" });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
