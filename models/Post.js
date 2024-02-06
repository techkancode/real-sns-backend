const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true //必須条件のrequired
    },
    desc : {
        type : String,
        max : 200
    },
    img : {
        type : String
    },
    likes : {
        type : Array, //誰がいいねを押しているのかを配列で確保する
        default : []
    },
},
{timestamps : true} //日時を取得
)

module.exports = mongoose.model("Post", PostSchema) //postSchemaをPostという名前のmodel()としてexportする