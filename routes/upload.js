const router = require("express").Router();//express内のRouter()関数をインスタンス化
const multer = require("multer"); //multerをインポート

const upload = multer(storage);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images") //画像を保存するディレクトリを指定
    },
    filename: (req, file, cb) => {
        cb(null, file.body.name) //画像の名前を指定
    }
})


//画像アップロード用API
router.post("/", upload.single("file"), (req, res) => {
    try{
        res.status(200).json("画像がアップロードされました")
    }catch (err){
        res.status(500).json(err) // errがあった際にはstatusコード500の内容がjson形式で表示される
    }
});

module.exports = router;
