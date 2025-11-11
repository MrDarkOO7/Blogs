import React from "react";
import { Link } from "react-router-dom";

const BlogsDisplay = ({ posts }) => {
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post._id} className="post-item">
          <Link to={`/posts/${post._id}`} className="post-title">
            {post.title}
          </Link>
          <div className="post-meta">
            By <span className="post-author">{post.authorId.name}</span> on{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BlogsDisplay;
