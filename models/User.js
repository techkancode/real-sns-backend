const mongoose = require("mongoose");

//mongooseの中のSchemaというクラスを使う。(インスタンス化)
const userSchema = new mongoose.Schema(
    {
    username : {
        type : String,
        required : true, //required = 必須条件
        min : 3,
        max : 25,
        unique : true //unique = 他と重複があってはならない
    },
    email : {
        type : String,
        required : true,
        max : 50,
        unique : true
    },
    password : {
        type : String,
        required : true,
        min : 6,
        max : 50
    },
    profilePicture : {
        type : String, //画像のパスのための要素
        default : ""
    },
    coverPicture : {
        type : String,
        default : ""
    },
    followers : {
        type : Array, //フォロワーは増えていくから配列に格納するようにする
        default : []
    },
    followings : {
        type : Array, //フォロワーは増えていくから配列に格納するようにする
        default : []
    },
    isAdmin : {
        type : Boolean, //権限があるかないか(ログインしているか)の真理値
        default : false
    },
    desc : {
        type : String,
        max : 70
    },
    city : {
        type : String,
        max : 50
    },
},

{timestamps : true}

);

module.exports = mongoose.model("User", userSchema);