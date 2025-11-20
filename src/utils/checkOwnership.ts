import Post from "../models/Post";

export const checkOwnership = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);
  if (!post) return false;
  return post.user.toString() === userId;
};
