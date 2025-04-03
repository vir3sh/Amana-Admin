import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../utils/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "sonner";

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
       `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        formData
      );
      setAuthToken(res.data.token);
      setAuth(true);
      toast.success("Login successful!");
      navigate("/flowers");
    } catch (error) {
      toast.error("Login failed! Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#fcb040]">
      <Toaster richColors position="top-center" />
      <Card className="w-[380px] bg-white shadow-2xl rounded-2xl p-6 border border-gray-200">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-500 text-sm mt-1">Access your dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2a734f]"
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2a734f]"
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              className="w-full bg-[#2a734f] hover:bg-[#1a2f25] text-white font-semibold py-3 rounded-lg transition-all"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
