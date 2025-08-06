import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Component/Common/LoginPage";
import Signup from "./pages/Component/Common/SignupPage";
import Forgot from "./pages/Component/Common/ForgotPasswordPage";
import Detect from "./pages/Component/Common/DetectPage";
import Embed from "./pages/Component/Common/EmbedPage";
import Token from "./pages/Component/Common/TokenPage";
import Api from "./pages/Component/Common/Api";
import Plan from "./pages/Component/Common/Plan";
import MyPage from "./pages/Component/Common/MyPage";
import './i18n';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Forgot" element={<Forgot />} />
      <Route path="/detect" element={<Detect />} />
      <Route path="/embed" element={<Embed />} />
      <Route path="/token" element={<Token />} />
      <Route path="/api" element={<Api />} />
      <Route path="/plan" element={<Plan />} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  );
}

export default App;