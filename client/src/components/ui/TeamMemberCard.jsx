import { Folder, MessageSquare, Mail, TrendingUp } from 'lucide-react';

const TeamMemberCard = ({member})=> {
    
  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-gray-100 p-6 w-full max-w-115 relative">
      
      {/* 1. Profile Section */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          {/* Gradient Avatar */}
          <div className="w-13 h-13 rounded-full bg-linear-to-br from-blue-500 via-blue-300 to-blue-500 flex items-center justify-center text-gray-100 text-xl font-bold shadow-sm">
            {member.avatar}
          </div>
          {/* Online Indicator */}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-[3px] border-white rounded-full"></div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{member.name}</h3>
          <p className="text-[13px] text-gray-500 font-medium">{member.role}</p>
        </div>
      </div>

      {/* 2. Active Projects */}
      <div className="mb-6">
        <h4 className="text-[14px] font-semibold text-gray-900 mb-2">Active Projects:</h4>
        <div className="flex flex-wrap gap-2.5">
          {member.projects.map((project,idx)=>(
            <span key={idx} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#eaeaec] text-gray-800 rounded-full text-xs font-semibold shadow-sm">
            <Folder className="w-3.5 h-3.5 fill-white/20" strokeWidth={2.5} />
            {project}
          </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-100 mb-2" />

      {/* 3. Stats Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Active Tasks */}
        <div className="text-center flex flex-col items-center justify-center">
          <div className="text-[35px] font-extrabold text-[#EAB308] leading-none mb-2 tracking-tight">{member.tasks.active}</div>
          <div className="text-[13px] text-gray-800 font-medium">Active Tasks</div>
        </div>
        
        {/* Completed Tasks */}
        <div className="text-center flex flex-col items-center justify-center">
          <div className="text-[35px] font-extrabold text-[#0EA5E9] leading-none mb-2 tracking-tight">{member.tasks.completed}</div>
          <div className="text-[13px] text-gray-800 font-medium">Completed (Last 30 Days)</div>
          <div className="flex items-center justify-center gap-1 text-[12px] font-bold text-green-600 mt-1.5">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
            +3 this week
          </div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50/50 hover:bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-[15px] font-semibold transition-all">
          <MessageSquare className="w-4 h-4" strokeWidth={2.5} />
          Chat
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-[15px] font-semibold transition-all">
          <Mail className="w-4 h-4" strokeWidth={2.5} />
          Email
        </button>
      </div>
      
    </div>
  );
}

export default TeamMemberCard;