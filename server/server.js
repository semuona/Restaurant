const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

app.use("/users", require("./api/users"));
app.use("/posts", require("./api/posts"));
app.use("/message", require("./api/message"));
//app.use("/posts/notes", require("./api/notes"));

const connectToDb = require("./config/db");
connectToDb();

// app.use(express.static("./server/uploads"));
// app.use('/message', require("./api/message"))
const port = process.env.PORT || 8080;

app.listen(port, () => console.log("server is up and running at port", port));

app.use(express.static("client/build"));

if (process.env.NODE_ENV === "production") {
  const path = require("path");

  app.get("/*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"))
  );
}
