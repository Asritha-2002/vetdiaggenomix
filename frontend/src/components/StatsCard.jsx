const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="p-6 rounded-2xl bg-white/90 backdrop-blur border shadow-md hover:-translate-y-1 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-xl font-bold text-gray-800">{value}</h2>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;