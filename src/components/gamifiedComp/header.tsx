import React, { useState } from 'react'

export default function Header() {
	const [level] = useState(4);
	const [xp] = useState(3);
	const [maxXp] = useState(5);
	const [badge] = useState('Expert');
	const [health] = useState(5);

  return (
    <header className="flex justify-between items-center mb-8">
			{/* Level & XP */}
			<div className="flex items-center gap-3">
				<span className="text-xl font-extrabold text-teal-300">{level}</span>
				<div className="w-40 h-5 bg-gray-800 rounded-xl overflow-hidden shadow-inner">
					<div
						className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-xl"
						style={{ width: `${(xp / maxXp) * 100}%` }}
					></div>
				</div>
				<span className="text-sm text-gray-300 font-medium">{xp}/{maxXp}</span>
			</div>

			{/* Badge & Health */}
			<div className="flex items-center gap-6">
				<span className="text-lg font-bold text-yellow-300">{badge} 🏅</span>
				<span className="text-lg font-bold text-red-400">{health} ❤️</span>
			</div>
		</header>
  )
}
