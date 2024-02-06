const router = require("express").Router();//express内のRouter()関数をインスタンス化
const User = require("../models/User");

//ユーザー登録
router.post("/register", async (req, res) => {
    try{
        const newUser = await new User({
            username : req.body.username,
            email : req.body.email,
            password : req.body.password
        })
        const user = await newUser.save(); //上で取得したドキュメントを保存する
        return res.status(200).json(err) //何もエラーがない場合のstatusコードは200
    }catch (err){
        res.status(500).json(err) // errがあった際にはstatusコード500の内容がjson形式で表示される
    }
})

//ログイン
router.post("/login", async (req, res) => {
    try{
        const user = await User.findOne({email : req.body.email}); //reqで送ったemailと相当するものを1つ探してとってくる
        if(!user) return res.status(404).send("ユーザーが見つかりません");

        const vailedPassword = req.body.password === user.password; //"==="は左辺と右辺が等しければtrueを変数vailedPasswordに返す。そうでなければfalseを返す。
        if (!vailedPassword) return res.status(400).send("パスワードが違います");

        return res.status(200).json(user);
    }catch(err) {
        return res.status(500).json(err);
    }
})


//router.get("/", (req, res) => {
//    res.send("auth Router")
//})

module.exports = router