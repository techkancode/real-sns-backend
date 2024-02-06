const router = require("express").Router();//express内のRouter()関数をインスタンス化
const Post = require("../models/Post");
const User = require("../models/User");

//投稿を作成する
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save() //savedPostにnewPostをセーブする
        return res.status(200).json(savedPost);
    }catch (err) {
        return res.status(500).json(err);
    }
})

//投稿を更新する
router.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.updateOne({
                $set : req.body
            })
            return res.status(200).json("投稿編集に成功しました。")
        }
        else {
            return res.status(403).json("あなたは他の人の投稿を編集できません。")
        }
    }catch (err) {
        return res.status(500).json(err)
    }
})

//投稿を削除する
router.delete("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.deleteOne(); //引数を取らない場合は、postの内容全てを一つの塊として削除
            return res.status(200).json("投稿の削除に成功しました。")
        }
        else {
            return res.status(403).json("あなたは他の人の投稿を削除できません。")
        }
    }catch (err) {
        return res.status(500).json(err)
    }
})

//特定の投稿を取得する
router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
        return res.status(200).json(post)
    }catch (err) {
        return res.status(500).json(err)
    }
})

//特定の投稿にいいねを押す
router.put("/:id/likes", async (req, res) => {
    const post = await Post.findById(req.params.id)
    if(post.userId !== req.body.userId){
        try{
            //req.params.idの投稿のlikesの配列の中に、req.body.userIdが格納されていなければいいねできる
            if(!post.likes.includes(req.body.userId)){
                await post.updateOne({
                    $push : {
                        likes : req.body.userId
                    }
                })
                return res.status(200).json("投稿にいいねしました")
            }
            else{
                await post.updateOne({
                    $pull : {
                        likes : req.body.userId
                    }
                })
                return res.status(200).json("投稿にいいねを削除しました。")
            }
        }catch (err) {
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(500).json("自分自身の投稿にいいねできません");
    }

})

//タイムラインの投稿を取得
router.get("/timeline/:userId", async (req, res) => { //"timeline/allにした理由は、別のapiのgetメソッドの/:idで取得する文字列と混同しないため"
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId : currentUser._id});
        //自分がフォローしている友達の投稿内容を全て取得する
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId : friendId});
            })
        );
        return res.status(200).json(userPosts.concat(...friendPosts));
    }catch (err){
        return res.status(500).json(err);
    }
})

//プロフィール専用のタイムラインの投稿を取得
router.get("/profile/:username", async (req, res) => { //"timeline/allにした理由は、別のapiのgetメソッドの/:idで取得する文字列と混同しないため"
    try{
        const user = await User.findOne({username : req.params.username});
        const posts = await Post.find({userId : user._id});
        return res.status(200).json(posts);
    }catch (err){
        return res.status(500).json(err);
    }
})
    
module.exports = router