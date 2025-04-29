import { useState } from "react";
import { Redirect } from "wouter";
import { useAuth, LoginData, RegisterData } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
    },
  });
  
  const handleLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };
  
  const handleRegister = (data: RegisterData) => {
    registerMutation.mutate(data);
  };
  
  // Redirect to homepage if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      {/* Left Column - Forms */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <svg className="h-10 w-10 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-2 text-2xl font-bold text-gray-900">TaskMaster</span>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...loginForm.register("username")}
                  />
                  {loginForm.formState.errors.username && (
                    <p className="text-sm text-red-500">
                      {loginForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...loginForm.register("password")}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...registerForm.register("name")}
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    placeholder="your.email@example.com"
                    {...registerForm.register("username")}
                  />
                  {registerForm.formState.errors.username && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <Input
                    id="registerPassword"
                    type="password"
                    placeholder="••••••••"
                    {...registerForm.register("password")}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Password must be at least 6 characters
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Right Column - Hero */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-white p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-extrabold mb-6">Welcome to TaskMaster</h1>
          <p className="text-xl mb-8">The simple way to manage your tasks and get things done</p>
          
          <div className="grid grid-cols-1 gap-6 mt-12">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium">Organize Tasks</h3>
                <p className="mt-1 text-white/80">Keep track of all your tasks in one place with an intuitive interface.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium">Set Priorities</h3>
                <p className="mt-1 text-white/80">Mark tasks with different priority levels to focus on what matters most.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium">Track Progress</h3>
                <p className="mt-1 text-white/80">See your completed tasks and stay motivated with visual progress indicators.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
