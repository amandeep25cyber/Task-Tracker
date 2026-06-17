
export function Card({ children, className = "", title, action }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {action}
        </div>
      )}
      <div className={title ? "p-6" : ""}>{children}</div>
    </div>
  );
}



export function StatCard({ title, value, change, icon, trend = "neutral" }) {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {change && (
              <p className={`text-sm ${
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"
              }`}>
                {change}
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
}
