"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/auth-client";
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

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    await resetPassword(
      { newPassword: password, token },
      {
        onError: (ctx: { error: { message: string } }) => {
          setError(ctx.error.message || "Something went wrong");
          setLoading(false);
        },
        onSuccess: () => {
          setDone(true);
          setLoading(false);
        },
      }
    );
  }

  if (done) {
    return (
      <Card className="border-0 bg-white/5 text-white shadow-2xl backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl font-bold text-white">
            Password Reset
          </CardTitle>
          <CardDescription className="text-white/60">
            Your password has been successfully reset.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button className="w-full bg-adi-red hover:bg-adi-red/90">
              Sign In
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
          Set New Password
        </CardTitle>
        <CardDescription className="text-white/60">
          Enter your new password below.
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
            <Label htmlFor="password" className="text-white/80">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-white/80">
              Confirm Password
            </Label>
            <Input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              required
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-adi-red hover:bg-adi-red/90"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
