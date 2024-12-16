import { useNavigate } from "react-router-dom";
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
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm rounded-md text-destructive bg-destructive/10">
                {error}
              </div>
            )}

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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div className="flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div> */}
            <Button
              type="submit"
              className="w-full bg-primary dark:text-white"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {/* <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create account
          </Link>
        </div>
      </CardFooter> */}
    </Card>
  );
}
