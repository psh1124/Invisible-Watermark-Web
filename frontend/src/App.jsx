import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Component/Common/LoginPage";
import Signup from "./pages/Component/Common/SignupPage";
import Forgot from "./pages/Component/Common/ForgotPasswordPage";
import Free from "./pages/Component/Common/Freebutton";
import Detect from "./pages/Component/Common/DetectPage";
import Embed from "./pages/Component/Common/EmbedPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Forgot" element={<Forgot />} />
      <Route path="/free" element={<Free />} />
      <Route path="/detect" element={<Detect />} />
      <Route path="/embed" element={<Embed />} />
    </Routes>
  );
}

export default App;