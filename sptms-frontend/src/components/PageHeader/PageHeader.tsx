import React from "react";

const PageHeader: React.FC = () => {
  return (
    <div className="bg-white flex justify-between items-center px-6 py-4 border-b-1 border-gray-200">
      <div>
        <p className="font-bold text-2xl text-slate-900">Dashboard</p>
        <p className="text-slate-500 text-sm">Manage transportation system</p>
      </div>
      <div>
        <p className="text-slate-900 text-sm">Admin User</p>
        <p className="text-xs text-slate-500">System Administrator</p>
      </div>
    </div>
  );
};

export default PageHeader;
