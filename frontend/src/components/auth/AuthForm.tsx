import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  onLogin: (token: string) => void;
}

export const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // API URL configuration
  const getApiUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
    return 'https://tiktokshop-1-i7zg.onrender.com';
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/6893104ffcd547192ddd9893/1j1v7fe1o";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch (error) {
        // Script may have already been removed
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const baseUrl = getApiUrl();
    const url = isLogin
      ? `${baseUrl}/auth/login`
      : `${baseUrl}/auth/signup`;

    const payload = isLogin
      ? { email, password }
      : {
          username: name,
          email,
          password,
          phone_number: phone,
        };

    console.log("🔄 Making auth request to:", url);
    console.log("🔄 Environment:", window.location.hostname);
    console.log("🔄 Payload:", isLogin ? { email, password: "***" } : { ...payload, password: "***" });

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("❌ Non-JSON response:", textResponse);
        throw new Error("Server returned invalid response format");
      }

      const data = await response.json();
      console.log("📦 Response data:", data);

      if (!response.ok) {
        // Handle different error formats
        const errorMessage = data.detail || data.message || data.error || `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (isLogin) {
        const token = data.access_token;
        const id = data.user_id;
        
        console.log("✅ Login successful!");
        console.log("🔑 Token received:", token ? "Yes" : "No");
        console.log("👤 User ID:", id);
        
        if (!token) {
          throw new Error("No access token received from server");
        }

        // Validate token format (should be JWT with 3 parts)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error("❌ Invalid token format:", token);
          throw new Error("Invalid token format received");
        }

        // Store authentication data
        localStorage.setItem("auth-token", token);
        if (id) {
          localStorage.setItem("user_id", id.toString());
        }
        
        console.log("💾 Token stored:", localStorage.getItem("auth-token") ? "Yes" : "No");

        // Test token parsing
        try {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log("🔍 Token payload:", payload);
          console.log("⏰ Token expires:", new Date(payload.exp * 1000));
        } catch (err) {
          console.error("⚠️ Error parsing token:", err);
        }

        onLogin(token);

        toast({
          title: "Welcome back!",
          description: "Successfully logged in to your dashboard.",
        });
        
        navigate("/dashboard");
      } else {
        toast({
          title: "Account created!",
          description: "You can now log in with your credentials.",
        });

        // Reset form for login
        setIsLogin(true);
        setPassword("");
        setName("");
        setPhone("");
      }
    } catch (error) {
      console.error("❌ Authentication error:", error);
      
      let errorMessage = "Something went wrong";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Request timed out. The server might be sleeping. Please try again.";
        } else if (error.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes('CORS')) {
          errorMessage = "Connection blocked. Please try refreshing the page.";
        } else {
          errorMessage = error.message;
        }
      }

      // Show specific error for common issues
      if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (errorMessage.includes("404")) {
        errorMessage = "Authentication service unavailable. Please try again later.";
      } else if (errorMessage.includes("500")) {
        errorMessage = "Server error. Please try again in a few minutes.";
      }

      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevated bg-gradient-card border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to access your dashboard"
              : "Start managing your business now"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full"
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </CardFooter>
        </form>
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 text-xs text-muted-foreground border-t">
            <div>Environment: {window.location.hostname}</div>
            <div>API URL: {getApiUrl()}</div>
          </div>
        )}
      </Card>
    </div>
  );
};