import React, { useEffect, useState } from "react";
import { api } from "../api";
import BlogsDisplay from "../Components/BlogsDisplay";
import { Link } from "react-router-dom";

const MyBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts/myposts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
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
      <h2>My Blogs</h2>
      {posts.length === 0 ? (
        <>
          {/* <p>You have not posted any blogs yet.</p> */}
          <Link to="/create">Click here to create your first blog</Link>
        </>
      ) : (
        <BlogsDisplay posts={posts} />
      )}
    </div>
  );
};

export default MyBlogs;
