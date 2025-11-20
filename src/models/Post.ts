import mongoose, { Document,Schema } from "mongoose";
 export interface PublicationLogInputs{
    time:Date,
    message:string

 }

 export interface PostInputs extends Document{
    user: mongoose.Types.ObjectId
    content: string
    platforms: string[]
    imageUrl?: string
    scheduledAt:Date
    status: "draft" | "scheduled" | "published" | "failed";
    createdAt: Date
    publicationLogs: PublicationLogInputs[]
}

const publicationLogSchema =new Schema<PublicationLogInputs>({
    time:{type:Date, required:true},
    message:{type:String}

})


const postSchema= new Schema<PostInputs>({
    user:{type: Schema.Types.ObjectId, ref: "User", required: true, index: true},
      content: { type: String, required: true, maxlength: 500 },
      platforms: [{type: String}],
      imageUrl: {type: String},
        scheduledAt: { type: Date, required: true, index: true },
         status: {
    type: String,
    enum: ["draft", "scheduled", "published", "failed"],
    default: "draft",
    index: true
  },
  createdAt: { type: Date, default: Date.now, index: true },
  publicationLogs: [publicationLogSchema]



});


// Important compound index for scheduler performance
postSchema.index({ status: 1, scheduledAt: 1, createdAt: 1 });

export default mongoose.model<PostInputs>("Post", postSchema);