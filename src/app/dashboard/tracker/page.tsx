export default function Tracker() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[rgb(87,204,2)] mb-6">
          📊 Financial Tracker
        </h1>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Total Balance</h3>
              <p className="text-3xl font-bold text-[rgb(87,204,2)]">$12,450</p>
              <p className="text-sm text-green-400 mt-1">+$320 this month</p>
            </div>

            <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Monthly Spending</h3>
              <p className="text-3xl font-bold text-[rgb(87,204,2)]">$2,180</p>
              <p className="text-sm text-red-400 mt-1">-$45 vs budget</p>
            </div>

            <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Savings Rate</h3>
              <p className="text-3xl font-bold text-[rgb(87,204,2)]">23%</p>
              <p className="text-sm text-green-400 mt-1">+2% this month</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-4">
                Spending Categories
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Housing</span>
                  <span className="text-[rgb(87,204,2)] font-medium">$800</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Food & Dining</span>
                  <span className="text-[rgb(87,204,2)] font-medium">$450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Transportation</span>
                  <span className="text-[rgb(87,204,2)] font-medium">$280</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Entertainment</span>
                  <span className="text-[rgb(87,204,2)] font-medium">$150</span>
                </div>
              </div>
            </div>

            <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-4">
                Recent Transactions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[rgb(87,204,2)]/10">
                  <div>
                    <p className="text-gray-300 font-medium">Grocery Store</p>
                    <p className="text-sm text-gray-500">Today</p>
                  </div>
                  <span className="text-red-400">-$85.50</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[rgb(87,204,2)]/10">
                  <div>
                    <p className="text-gray-300 font-medium">Salary Deposit</p>
                    <p className="text-sm text-gray-500">Yesterday</p>
                  </div>
                  <span className="text-green-400">+$3,200</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-gray-300 font-medium">Coffee Shop</p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                  <span className="text-red-400">-$4.75</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
