import exp from "express";
import { register } from "../services/authservice.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {upload} from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';
export const userRoute = exp.Router();

// Register user
userRoute.post("/users",upload.single("profilePic"),async (req, res, next) => {
let cloudinaryResult;
    try {
        let userObj = req.body;

        //  Step 1: upload image to cloudinary from memoryStorage (if exists)
        if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        }

        // Step 2: call existing register()
        const newUserObj = await register({
        ...userObj,
        role: "USER",
        profileImageUrl: cloudinaryResult?.secure_url,
        });

        res.status(201).json({
        message: "user created",
        payload: newUserObj,
        });

    } catch (err) {

        // Step 3: rollback 
        if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }

        next(err); // send to your error middleware
    }

}
);


//Read all articles protected route
userRoute.get('/articles',async(req,res)=>{
  try{

  // get all the articles
  const allArticles=await ArticleModel.find().populate("author","firstName")
  let allActiveArticles=[]
  for(let eachArticle of allArticles){
    if(eachArticle.isArticleActive){
      allActiveArticles.push(eachArticle)
    }
  }
  res.status(200).json({message:"all active articles",payload:allActiveArticles})
}catch(err){
  return res.status(400).json({message:err.message})
}
})

// Add comment to an article protected route
userRoute.put('/articles', verifyToken("USER"), async (req, res) => {

  const { articleId, comment } = req.body;
  const userId = req.user.userId; // always trust token
  const newComment = {
    user: userId,
    comment,
    date: new Date()
  };

  try {

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      articleId,
      { $push: { comments: newComment } },
      { new: true }
    ).populate("comments.user", "email firstName lastName");

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({
      message: "New comment added",
      payload: updatedArticle
    });

  } catch (err) {

    res.status(500).json({ message: "Server error", error: err.message });
  }

});