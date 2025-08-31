"use client";

import React from "react";
import { Mail, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import BaseBackground from "@/components/base/BaseBackground";

// export const dynamic = 'force-dynamic'
// export const revalidate = 0

const EmailVerificationPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <BaseBackground />
      {/* Main Content Container */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl px-8 py-6 text-center">
        {/* Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg">
            {/* Example icon */}
            {/* <Mail className="w-10 h-10 text-white" strokeWidth={1.5} /> */}
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-white">
            Check your email
          </h1>
          <p className="text-gray-300 text-base max-w-sm mx-auto">
            We&apos;ve sent a verification link to your email address. Please
            check your inbox to continue.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-6">
          <Button
            className="w-full h-11 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2 rounded-lg shadow-md hover:opacity-90 transition"
            onClick={() =>
              window.open("https://mail.google.com/mail/u/0/#inbox", "_blank")
            }
          >
            Open mail app
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            className="w-full h-11 text-gray-200 hover:text-white hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 rounded-lg transition"
            onClick={() => {
              toast({ description: "Verification email resent successfully!" });
            }}
          >
            Resend email
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-sm text-gray-400">
            Didn&apos;t receive the email? Check your spam folder or contact
            support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
