import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";
import "../styles/postview.css";

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  if (loading) return <div className="postview-container">Loading...</div>;
  if (error) return <div className="postview-container error">{error}</div>;
  if (!post) return <div className="postview-container">Post not found.</div>;

  const isOwner = isAuthenticated && user._id === post.authorId._id;

  return (
    <div className="postview-container">
      <h1 className="post-title">{post.title}</h1>
      <div className="post-meta">
        By <span className="post-author">{post.authorId.name}</span> on{" "}
        {new Date(post.createdAt).toLocaleDateString()}
        {post.updatedAt !== post.createdAt && (
          <span>
            {" "}
            (Updated: {new Date(post.updatedAt).toLocaleDateString()})
          </span>
        )}
      </div>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {isOwner && (
        <div className="post-actions">
          <Link to={`/edit/${post._id}`} className="btn edit-btn">
            Edit
          </Link>
          <button className="btn delete-btn" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostView;
