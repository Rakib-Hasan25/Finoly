"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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

import { Loader2, Moon, Sun } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import BaseBackground from "@/components/base/BaseBackground";

export default function EmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    try {
      const origin = window.location.origin;
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
      const redirectUrl = `${siteUrl || origin}/auth/callback`;

      // console.log('Debug info:', {
      //   windowOrigin: origin,
      //   envSiteUrl: siteUrl,
      //   finalRedirectUrl: redirectUrl
      // })
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
          }/auth/callback`,
        },
      });

      if (error) throw error;

      router.push(`/auth/otp?email=${encodeURIComponent(email)}`);
      toast({
        title: "Magic link sent",
        description: "Check your email for the login link.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to send magic link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <BaseBackground />
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-white">
              Get Started
            </CardTitle>
          </div>
          <CardDescription className="text-gray-200">
            Enter your email to sign in or create an account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="mr-4 ml-4">
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-100">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-white/5 border border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Magic Link
                </>
              ) : (
                "Continue with Email"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
