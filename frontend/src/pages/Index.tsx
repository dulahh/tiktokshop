import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("auth-token");
    if (token) {
      setIsAuthenticated(true);
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

    // if (loading) {
    //   return (
    //     <div className="min-h-screen flex items-center justify-center bg-background">
    //       <div className="text-center">
    //         <p className="text-xl text-muted-foreground">Loading...</p>
    //       </div>
    //     </div>
    //   );
    // }

  return <AuthForm onLogin={handleLogin} />;
};

export default Index;
