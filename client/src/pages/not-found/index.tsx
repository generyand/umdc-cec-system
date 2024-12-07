import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Home } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigate("/");
    }, 10000);

    const countdownInterval = setInterval(() => {
      setCountdown((currentCount) => currentCount - 1);
    }, 1000);

    return () => {
      clearTimeout(redirectTimeout);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-screen bg-background">
      <div className="mx-auto space-y-6 max-w-lg text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <AlertCircle className="mx-auto w-24 h-24 animate-pulse text-destructive" />
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground">
            Oops! The page you are looking for might have been removed or is
            temporarily unavailable.
          </p>
        </div>

        {/* Countdown Section */}
        <div className="flex gap-2 justify-center items-center text-muted-foreground">
          <Clock className="w-5 h-5" />
          <p>
            Redirecting to homepage in{" "}
            <span className="font-bold">{countdown}</span> seconds
          </p>
        </div>

        {/* Action Button */}
        <Button onClick={() => navigate("/")} className="gap-2" size="lg">
          <Home className="w-4 h-4" />
          Return to Homepage
        </Button>
      </div>
    </div>
  );
}
