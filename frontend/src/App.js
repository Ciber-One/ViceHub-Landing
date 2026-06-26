import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import PostEditor from "@/pages/admin/PostEditor";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/new" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
            <Route path="/admin/edit/:id" element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
       <Analytics />
      <Toaster position="top-center" theme="dark" />
    </div>
  );
}

export default App;
