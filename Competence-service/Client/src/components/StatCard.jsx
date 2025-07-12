import React from 'react';

const StatCard = ({ icon, title, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white',
    green: 'bg-gradient-to-br from-green-500 to-emerald-600 text-white',
    purple: 'bg-gradient-to-br from-purple-500 to-violet-600 text-white',
    orange: 'bg-gradient-to-br from-orange-500 to-amber-600 text-white'
  };

  const shadowClasses = {
    blue: 'shadow-blue-200',
    green: 'shadow-green-200',
    purple: 'shadow-purple-200',
    orange: 'shadow-orange-200'
  };

  return (
    <div className={`stat-card group hover:shadow-2xl ${shadowClasses[color]}`}>
      <div className="flex items-center">
        <div className={`p-4 rounded-2xl ${colorClasses[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;