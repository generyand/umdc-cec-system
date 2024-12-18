import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons/icons";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, user, initialized } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!initialized || isLoading) return;

    if (user) {
      const destination = user.role === "ADMIN" ? "/admin" : "/";
      navigate(destination, { replace: true });
    }
  }, [user, isLoading, initialized, navigate]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login(values.email, values.password);
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  // If user is already logged in and we're not loading, show loading state
  if (user && !isLoading) {
    return <div>Redirecting...</div>;
  }

  return (
    <Card className="w-full max-w-[400px] border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-4 pb-6">
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 text-sm rounded-md text-destructive bg-destructive/10">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                        disabled={isLoading}
                        autoComplete="email"
                        autoCapitalize="none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium text-foreground/90">
                        Password
                      </FormLabel>
                      <Link
                        to="/auth/forgot-password"
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 bg-white/50 border-gray-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 pr-10"
                          {...field}
                          disabled={isLoading}
                          autoComplete="current-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground/60 hover:text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Icons.eyeOff className="h-4 w-4" />
                          ) : (
                            <Icons.eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-medium bg-primary hover:bg-primary/90 text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Icons.spinner className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Sign in to your account"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Protected by UM Digos College
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
