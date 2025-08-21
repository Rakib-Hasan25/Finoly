export default function GamifiedLearning() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[rgb(87,204,2)] mb-6">
          🎮 Gamified Learning
        </h1>
        
        <div className="space-y-6">
          <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-[rgb(87,204,2)] mb-4">
              Current Level: Financial Explorer
            </h2>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div className="bg-[rgb(87,204,2)] h-3 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-gray-300">65% to next level</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-3">
                Available Challenges
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Budget Master Challenge</li>
                <li>• Investment Basics Quest</li>
                <li>• Debt Freedom Mission</li>
                <li>• Emergency Fund Builder</li>
              </ul>
            </div>

            <div className="bg-[rgb(25,45,54)] border border-[rgb(87,204,2)]/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[rgb(87,204,2)] mb-3">
                Achievements
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">🏆</span>
                  <span className="text-gray-300">First Budget Created</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">🎯</span>
                  <span className="text-gray-300">Savings Goal Met</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
