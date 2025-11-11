import React, { useEffect, useState } from "react";
import { api } from "../api";
import "../styles/home.css";
import BlogsDisplay from "../Components/BlogsDisplay";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        console.log(res);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="home-container">Loading posts...</div>;
  if (error) return <div className="home-container error">{error}</div>;

  return (
    <div className="home-container">
      <h2>All Blogs</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <BlogsDisplay posts={posts} />
      )}
    </div>
  );
};

export default Home;
