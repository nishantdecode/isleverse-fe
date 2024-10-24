import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";

export function SignUpForm({
  name,
  setName,
  email,
  setEmail,
  confirmpassword,
  setConfirmpassword,
  password,
  setPassword,
  submitHandler,
  loading,
  postDetails,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleConfirmPassword = () => {
    setConfirmShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <Card className="mx-auto max-w-sm sm:min-w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your details to create new account!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              type="text"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              type="email"
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={password}
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password && (
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-8"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            )}
          </div>
          <div className="relative grid gap-2">
            <Label htmlFor="password">Confirm Password</Label>
            <Input
              id="confirmpassword"
              value={confirmpassword}
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              onChange={(e) => setConfirmpassword(e.target.value)}
              required
            />
            {confirmpassword && (
              <button
                type="button"
                onClick={toggleConfirmPassword}
                className="absolute right-3 top-8"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            )}
          </div>
          <div className="grid gap-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Picture</Label>
              <Input
                id="picture"
                type="file"
                onChange={(e) => postDetails(e.target.files[0])}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            onClick={submitHandler}
            // isLoading={picLoading}
          >
            Sign Up
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
