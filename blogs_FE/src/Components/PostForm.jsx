import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";

import "../styles/postform.css";

const PostForm = ({ mode, postId }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  useEffect(() => {
    if (mode === "edit" && postId) {
      const fetchPost = async () => {
        try {
          const res = await api.get(`/posts/${postId}`);

          if (res.data.authorId._id !== user._id) {
            setError("You are not authorized to edit this post");
            return;
          }

          setTitle(res.data.title);

          if (editor && res.data.content) {
            editor.commands.setContent(res.data.content);
          }
        } catch (err) {
          console.error(err);
          setError("Failed to load post for editing");
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [mode, postId, user._id, editor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!editor) return;

    const content = editor.getHTML();

    if (!title.trim() || !content.trim() || content === "<p></p>") {
      setError("Title and content are required");
      return;
    }

    try {
      if (mode === "create") {
        const res = await api.post(
          "/posts",
          { title, content },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        navigate(`/my-blogs`);
      } else if (mode === "edit" && postId) {
        await api.put(
          `/posts/${postId}`,
          { title, content },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        navigate(`/posts/${postId}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Failed to save post");
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        You must be logged in.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>
    );
  }

  return (
    <div className="postform-container">
      <h2>{mode === "create" ? "Create New Blog" : "Edit Blog"}</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="postform-form">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
        />

        <label>Content</label>

        {editor && (
          <div className="toolbar" style={{ marginBottom: "8px" }}>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "active" : ""}
            >
              <b>B</b>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "active" : ""}
            >
              <i>I</i>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "active" : ""}
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "active" : ""}
            >
              1. List
            </button>
          </div>
        )}

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            minHeight: "200px",
            padding: "10px",
          }}
        >
          <EditorContent editor={editor} />
        </div>

        <button type="submit" style={{ marginTop: "12px" }}>
          {mode === "create" ? "Post" : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
