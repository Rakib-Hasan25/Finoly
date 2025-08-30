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
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            স্বাগতম{" "}
            <span className="text-blue-600 dark:text-blue-400">ফিনোলি</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            আপনার ব্যক্তিগত AI আর্থিক উপদেষ্টা। আধুনিক আর্থিক ব্যবস্থাপনা এবং শিক্ষার জন্য নির্মিত।
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              🚀 ড্যাশবোর্ডে যান
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-lg">
                    🤖
                  </span>
                </div>
                AI আর্থিক কোচ
              </CardTitle>
              <CardDescription>
                ব্যক্তিগতকৃত আর্থিক পরামর্শ এবং বাজেটিং টিপস।
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-lg">
                    🎮
                  </span>
                </div>
                গেমিফাইড শিক্ষা
              </CardTitle>
              <CardDescription>
                মজার গেমের মাধ্যমে আর্থিক শিক্ষা এবং দক্ষতা উন্নয়ন।
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 text-lg">
                    📊
                  </span>
                </div>
                আর্থিক ট্র্যাকিং
              </CardTitle>
              <CardDescription>
                আপনার আয়, ব্যয় এবং সঞ্চয়ের বিস্তারিত ট্র্যাকিং।
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Interactive Demo */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>আমাদের বৈশিষ্ট্যগুলি দেখুন</CardTitle>
            <CardDescription>
              নীচের ফর্মটি ব্যবহার করে দেখুন
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল</Label>
              <Input id="email" type="email" placeholder="আপনার ইমেইল দিন" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">নাম</Label>
              <Input id="name" placeholder="আপনার নাম দিন" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">জমা দিন</Button>
              <Button variant="outline" className="flex-1">
                বাতিল
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 text-slate-500 dark:text-slate-400">
          <p>
            আপনার আর্থিক ভবিষ্যত গড়ে তুলতে প্রস্তুত? এখনই শুরু করুন!
          </p>
        </div>
      </div>
    </div>
  );
}
