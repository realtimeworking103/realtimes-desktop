import { cn } from "@/ui/lib/utils";
import { Button } from "@/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import { Checkbox } from "@/ui/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const { login, error, isLoggingIn, setError } = useAuthStore();
  const navigate = useNavigate();

  // Load saved credentials on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem("rememberedCredentials");
    if (savedCredentials) {
      try {
        const { username: savedUsername, password: savedPassword } =
          JSON.parse(savedCredentials);
        setUsername(savedUsername);
        setPassword(savedPassword);
        setRememberPassword(true);
      } catch (error) {
        console.error("Error loading saved credentials:", error);
        localStorage.removeItem("rememberedCredentials");
      }
    }
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleRememberPasswordChange = (checked: boolean) => {
    setRememberPassword(checked);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน");
      return;
    }

    try {
      await login(username, password);

      // Save credentials if remember password is checked
      if (rememberPassword) {
        localStorage.setItem(
          "rememberedCredentials",
          JSON.stringify({
            username,
            password,
          }),
        );
      } else {
        // Remove saved credentials if not remembering
        localStorage.removeItem("rememberedCredentials");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your Username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  onChange={handleUsernameChange}
                  id="username"
                  type="text"
                  required
                  disabled={isLoggingIn}
                  value={username}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  onChange={handlePasswordChange}
                  id="password"
                  type="password"
                  required
                  disabled={isLoggingIn}
                  value={password}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberPassword"
                  checked={rememberPassword}
                  onCheckedChange={handleRememberPasswordChange}
                  disabled={isLoggingIn}
                />
                <Label htmlFor="rememberPassword" className="text-sm">
                  จดจำรหัสผ่าน
                </Label>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
              </div>
              {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
