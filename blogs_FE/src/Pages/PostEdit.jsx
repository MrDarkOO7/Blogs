import React from "react";
import { useParams } from "react-router-dom";
import PostForm from "../Components/PostForm";

const PostEdit = () => {
  const { id } = useParams();
  return <PostForm mode="edit" postId={id} />;
};

export default PostEdit;
