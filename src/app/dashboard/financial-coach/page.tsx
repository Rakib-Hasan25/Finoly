export default function FinancialCoach() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[rgb(87,204,2)] mb-6">
          💰 Financial Coach
        </h1>
        
        <div className="space-y-6">
          <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-[rgb(87,204,2)] mb-4">
              AI Financial Advisor
            </h2>
            <p className="text-gray-300 mb-4">
              Get personalized financial advice and insights based on your spending patterns and goals.
            </p>
            <div className="bg-[rgb(87,204,2)]/10 border border-[rgb(87,204,2)]/30 rounded-lg p-4">
              <p className="text-[rgb(87,204,2)] font-medium">
                💡 Tip: Consider increasing your emergency fund to cover 6 months of expenses.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-3">
                Personalized Insights
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Spending pattern analysis</li>
                <li>• Budget optimization tips</li>
                <li>• Investment recommendations</li>
                <li>• Debt reduction strategies</li>
              </ul>
            </div>

            <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-3">
                Ask Your Coach
              </h3>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Ask a financial question..."
                  className="w-full p-3 bg-gray-700 border border-[rgb(87,204,2)]/20 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[rgb(87,204,2)]/40"
                />
                <button className="w-full bg-[rgb(87,204,2)] text-[rgb(25,45,54)] py-2 px-4 rounded-lg font-medium hover:bg-[rgb(87,204,2)]/90 transition-colors">
                  Get Advice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
