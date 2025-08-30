export default function DashboardHome() {
  return (
    <div className="p-8 bg-[rgb(25,45,54)] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[rgb(87,204,2)] mb-2">
            আপনার ড্যাশবোর্ডে স্বাগতম
          </h1>
          <p className="text-gray-300 text-lg">
            আপনার আর্থিক অগ্রগতি ট্র্যাক করুন এবং আপনার লক্ষ্যগুলি পরিচালনা করুন
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6 hover:border-[rgb(87,204,2)]/40 transition-colors">
            <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-2">
              মোট ব্যালেন্স
            </h3>
            <p className="text-3xl font-bold text-white">$15,420</p>
          </div>

          <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6 hover:border-[rgb(87,204,2)]/40 transition-colors">
            <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-2">
              মাসিক আয়
            </h3>
            <p className="text-3xl font-bold text-white">$5,200</p>
          </div>

          <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6 hover:border-[rgb(87,204,2)]/40 transition-colors">
            <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-2">
              মাসিক ব্যয়
            </h3>
            <p className="text-3xl font-bold text-white">$3,800</p>
          </div>

          <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6 hover:border-[rgb(87,204,2)]/40 transition-colors">
            <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-2">
              সঞ্চয়ের হার
            </h3>
            <p className="text-3xl font-bold text-white">27%</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-4">
                সাম্প্রতিক কার্যক্রম
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/10 rounded-lg">
                  <div>
                    <p className="text-white font-medium">বেতন জমা</p>
                    <p className="text-gray-400 text-sm">আজ</p>
                  </div>
                  <span className="text-[rgb(87,204,2)] font-semibold">+$5,200</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/10 rounded-lg">
                  <div>
                    <p className="text-white font-medium">কেনাকাটা</p>
                    <p className="text-gray-400 text-sm">গতকাল</p>
                  </div>
                  <span className="text-red-400 font-semibold">-$120</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/10 rounded-lg">
                  <div>
                    <p className="text-white font-medium">কফি শপ</p>
                    <p className="text-gray-400 text-sm">২ দিন আগে</p>
                  </div>
                  <span className="text-red-400 font-semibold">-$8.50</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-4">
                দ্রুত কাজ
              </h3>
              <div className="space-y-3">
                <a href="/dashboard/tracker/spending" className="block w-full p-3 bg-[rgb(87,204,2)] text-[rgb(25,45,54)] rounded-lg font-medium hover:bg-[rgb(87,204,2)]/90 transition-colors text-center">
                  লেনদেন যোগ করুন
                </a>
                <a href="/dashboard/tracker/budget" className="block w-full p-3 border border-[rgb(87,204,2)]/40 text-[rgb(87,204,2)] rounded-lg font-medium hover:bg-[rgb(87,204,2)]/10 transition-colors text-center">
                  বাজেট নির্ধারণ করুন
                </a>
                <a href="/dashboard/gamified-learning" className="block w-full p-3 border border-[rgb(87,204,2)]/40 text-[rgb(87,204,2)] rounded-lg font-medium hover:bg-[rgb(87,204,2)]/10 transition-colors text-center">
                  শিক্ষার কেন্দ্র
                </a>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-4">
                শিক্ষার অগ্রগতি
              </h3>
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-[rgb(87,204,2)]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-[rgb(87,204,2)]">7</span>
                </div>
                <p className="text-white font-medium">লেভেল ৭</p>
                <p className="text-gray-400 text-sm">আর্থিক অনুসন্ধানকারী</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">অগ্রগতি</span>
                  <span className="text-white font-medium">68%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-[rgb(87,204,2)] h-2 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
