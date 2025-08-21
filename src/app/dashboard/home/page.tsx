export default function DashboardHome() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[rgb(87,204,2)] mb-6">
          Welcome to Your Dashboard
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6 hover:border-[rgb(87,204,2)]/40 transition-colors">
            <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-2">
              Quick Overview
            </h3>
            <p className="text-gray-300">
              Get a snapshot of your financial health and progress.
            </p>
          </div>

          <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6 hover:border-[rgb(87,204,2)]/40 transition-colors">
            <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-2">
              Recent Activity
            </h3>
            <p className="text-gray-300">
              Track your latest financial transactions and goals.
            </p>
          </div>

          <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6 hover:border-[rgb(87,204,2)]/40 transition-colors">
            <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-2">
              Next Steps
            </h3>
            <p className="text-gray-300">
              Personalized recommendations for your financial journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
