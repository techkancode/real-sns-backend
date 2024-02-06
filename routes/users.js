const router = require("express").Router();//express内のRouter()関数をインスタンス化
const User = require("../models/User");

//CRUD操作(Create Read Update Delete)
//ユーザー情報の更新
router.put("/:id", async (req, res) => {
    if (req.body.userid === req.params.id || req.body.isAdmin) {
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set : req.body, //$setはUserで指定したスキーマの要素を全て指定する
            });
            return res.status(200).json("ユーザー情報が更新されました")
        }catch (err){
            return res.status(500).json(err)
        }     
    }else{
        return res.status(403).json("あなたは自分のアカウントの時だけ情報を更新できます");
    }
})

//ユーザー情報の削除
router.delete("/:id", async (req, res) => {
    if (req.body.userid === req.params.id || req.body.isAdmin) {
        try{
            const user = await User.findByIdAndDelete(req.params.id) //引数にとるidのデータを削除する
            res.status(200).json("ユーザー情報が削除されました")
        }catch (err){
            return res.status(500).json(err)
        }     
    }else{
        return res.status(403).json("あなたは自分のアカウントの時だけ情報を削除できます");
    }
})

// //ユーザー情報の取得
// router.get("/:id", async (req, res) => {
//         try{
//             const user = await User.findById(req.params.id) //引数にとるidのデータを取得する。
//             const { password, updatedAt, ...other} = user._doc; //{}の中の要素にuser情報を順に代入する(分割代入): ...otherはスプレッド構文
//             return res.status(200).json(other) //"password"と"updatedAt"意外の情報(other)をjson形式で表記
//         }catch (err){
//             res.status(500).json(err)
//         }     
// })

//クエリでユーザー情報を取得
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    try{
        const user  = userId
        ? await User.findById(userId)
        : await User.findOne({username : username})
        const { password, updatedAt, ...other} = user._doc; //{}の中の要素にuser情報を順に代入する(分割代入): ...otherはスプレッド構文
        return res.status(200).json(other) //"password"と"updatedAt"意外の情報(other)をjson形式で表記
    }catch (err){
        return res.status(500).json(err)
    }     
})


//ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
    if(req.body.userid !== req.params.id){ //左辺は自分自身のid、右辺はこれからフォローするユーザーのid(bodyとはpostmanで記述する内容のこと)
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userid);
            //フォロワーに自分が居なかったらフォローできる
            if(!user.followers.includes(req.body.userid)){
                await user.updateOne({
                    //$pushでfollowersの配列にuseridを格納する。多分json形式？
                    $push : {
                        followers : req.body.userid
                    }
                })
                await currentUser.updateOne({
                    //$pushでfollowingsの配列にidを格納する。多分json形式？
                    $push : {
                        followings : req.params.id
                    }
                })
                return res.status(200).json("フォローに成功しました。")
            }else{
                return res.status(403).json("あなたはすでにこのユーザをフォローしています。")
            }
        }catch (err) {
            return res.status(500).json(err)
        }
    }else{
        return res.status(500).json("自分自身をフォローできません");
    }
})

//ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userid !== req.params.id){ //左辺は自分自身のid、右辺はこれからフォローするユーザーのid(bodyとはpostmanで記述する内容のこと)
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userid);
            //フォロワーに存在したらフォローを外せる
            if(user.followers.includes(req.body.userid)){
                await user.updateOne({
                    //$pullでfollowersの配列の中のuseridを取り除く。多分json形式？
                    $pull : {
                        followers : req.body.userid
                    }
                })
                await currentUser.updateOne({
                    //$pullでfollowingsの配列の中のidを取り除く。多分json形式？
                    $pull : {
                        followings : req.params.id
                    }
                })
                return res.status(200).json("フォローを解除しました。")
            }else{
                return res.status(403).json("このユーザーのフォロー解除をできません。")
            }
        }catch (err) {
            return res.status(500).json(err)
        }
    }else{
        return res.status(500).json("自分自身をフォロー解除できません");
    }
})

//router.get("/", (req, res) => {
//    res.send("user Router")
//})

module.exports = router