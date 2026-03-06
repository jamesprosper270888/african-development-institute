"use client";

import { useState } from "react";
import Link from "next/link";
import { forgetPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await forgetPassword(
      { email, redirectTo: "/reset-password" },
      {
        onError: (ctx: { error: { message: string } }) => {
          setError(ctx.error.message || "Something went wrong");
          setLoading(false);
        },
        onSuccess: () => {
          setSent(true);
          setLoading(false);
        },
      }
    );
  }

  if (sent) {
    return (
      <Card className="border-0 bg-white/5 text-white shadow-2xl backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl font-bold text-white">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-white/60">
            If an account exists for {email}, we have sent password reset
            instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button
              variant="outline"
              className="w-full border-white/10 text-white hover:bg-white/5"
            >
              Back to Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/5 text-white shadow-2xl backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl font-bold text-white">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-white/60">
          Enter your email and we will send you a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-adi-red hover:bg-adi-red/90"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
          <Link href="/login" className="block text-center">
            <span className="text-sm text-white/60 hover:text-white">
              Back to Sign In
            </span>
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
