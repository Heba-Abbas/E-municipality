import { Bell, Menu, Settings} from "lucide-react";

function DashboardTopbar() {
  return (
    <header className="mb-3 rounded-xl border border-[#2B3744] bg-[#151E27] px-4 py-3">
      <div className="flex items-center justify-between">
        
        {/* Right */}
        <div className="flex items-center gap-3">
            
          <button className="text-white"><Menu size={18} /></button>
          <h1 className="text-lg font-semibold text-white">الرئيسية</h1>
        </div>
        {/* Left */}
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-white">
            <span>Dark mode</span>

            <button className="relative h-5 w-10 rounded-full bg-emerald-500">
              <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
            </button>
          </div>
          <div className="h-5 w-px bg-gray-600" />

          <button><Bell size={18} /></button>

          <div className="h-5 w-px bg-gray-600" />
<button><Settings size={18} /></button>
          <div className="h-5 w-px bg-gray-600" />
          <div className="flex items-center gap-2">
            

            <div className="text-right leading-4">
              <p className="text-sm text-white">وسام أحمد</p>
              <p className="text-[11px] text-gray-400">(مدير النظام)</p>
            </div>
            <img
              src="/images/user.png"
              alt="user"
              className="h-8 w-8 rounded-full"
            />
          </div>

          

          
        </div>

      </div>

    </header>
  );
}

export default DashboardTopbar;
