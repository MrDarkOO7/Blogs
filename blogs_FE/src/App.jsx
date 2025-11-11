import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import PostCreate from "./Pages/PostCreate";
import MyBlogs from "./Pages/MyBlogs";
import PostEdit from "./Pages/PostEdit";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthProvider } from "./context/AuthContext";
import PostView from "./Pages/PostView";
import Layout from "./Components/Layout";

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="posts/:id" element={<PostView />} />
              <Route element={<ProtectedRoute />}>
                <Route path="create" element={<PostCreate />} />
                <Route path="my-blogs" element={<MyBlogs />} />
                <Route path="edit/:id" element={<PostEdit />} />
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
