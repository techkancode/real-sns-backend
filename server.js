const express = require("express"); //変数expressにexpressのフレームワークを格納
const app = express(); //expressをインスタンス化して起動させる
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");
// const uploadRouter = require("./routes/upload");
// const path = require("path");

const PORT = 3001;
const mongoose = require("mongoose");
require("dotenv").config();

//データベースと接続
mongoose.
    connect(process.env.MONGOURL)
    .then(() => {
        console.log("データベースと接続中・・・")
    }).catch((err) => {
        console.log(err)
    });

//ミドルウェア
// app.use("images", express.static(path.join(__dirname, "public/images")));
app.use(express.json()); //下の情報を全てjson形式で扱うための宣言
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
// app.use("/api/upload", uploadRouter);

//"/"ルートディレクトリをブラウザで認識すると、res(レスポンス)として"hello express"をsendする
app.get("/", (req, res) => {
    res.send("hello express");
});

app.listen(PORT, () => console.log("サーバーが起動しました。"));