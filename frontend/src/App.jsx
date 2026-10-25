import { Navigate, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Contact from "./pages/Contact";
import BookVisit from "./pages/BookVisit";
import Videos from "./pages/Videos";
import VideoAdminAuth from "./pages/VideoAdminAuth";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-visit" element={<BookVisit />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/video-admin/login" element={<VideoAdminAuth />} />
        <Route
          path="/video-admin/signup"
          element={<Navigate to="/video-admin/login" replace />}
        />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-conditions" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
