import React from "react";

export const BackgroundGlow = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Animated Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[100px]"></div>
      
      {/* Tech Grid/Mesh Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] brightness-100 contrast-150"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>
  );
};
