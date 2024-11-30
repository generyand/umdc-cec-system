import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import umdcLogo from "@/assets/images/umdc-logo.png";
import cecLogo from "@/assets/images/cec-logo.png";

function AuthLayout() {
  return (
    <div className="flex overflow-hidden w-full min-h-screen bg-background">
      {/* Left Panel - UMDC CEC Branding */}
      <div className="hidden overflow-hidden relative w-1/2 bg-primary dark:bg-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/80 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900/90" />

          {/* Floating Spheres */}
          <div className="absolute inset-0">
            {/* Large Spheres */}
            <div className="absolute top-[10%] right-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-white/30 to-white/5 dark:from-white/10 dark:to-white/5 blur-md" />
            <div className="absolute bottom-[20%] left-[5%] w-72 h-72 rounded-full bg-gradient-to-tr from-accent/40 to-accent/5 dark:from-slate-700/40 dark:to-slate-700/5 blur-md" />

            {/* Medium Spheres */}
            <div className="absolute top-[40%] left-[20%] w-48 h-48 rounded-full bg-gradient-to-bl from-white/25 to-white/5 dark:from-white/10 dark:to-white/5 blur-sm" />
            <div className="absolute bottom-[30%] right-[15%] w-56 h-56 rounded-full bg-gradient-to-tl from-accent/30 to-accent/5 dark:from-slate-700/30 dark:to-slate-700/5 blur-sm" />

            {/* Small Spheres */}
            <div className="absolute top-[60%] right-[25%] w-32 h-32 rounded-full bg-gradient-to-tr from-white/20 to-transparent dark:from-white/10" />
            <div className="absolute top-[25%] left-[40%] w-24 h-24 rounded-full bg-gradient-to-br from-accent/25 to-transparent dark:from-slate-700/25" />

            {/* Additional Small Spheres */}
            <div className="absolute top-[80%] right-[40%] w-20 h-20 rounded-full bg-gradient-to-tr from-white/25 to-transparent dark:from-white/10" />
            <div className="absolute top-[15%] left-[25%] w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-transparent dark:from-slate-700/30" />

            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-50" />
          </div>
        </div>

        {/* Content Container - Text colors updated for dark mode */}
        <div className="flex relative z-20 flex-col h-full">
          {/* Header */}
          <div className="flex gap-3 items-center mb-16">
            <div className="flex gap-2 items-center">
              <img
                src={umdcLogo}
                alt="UMDC Logo"
                className="w-14 h-14 rounded-full shadow-lg"
              />
              <img
                src={cecLogo}
                alt="CEC Logo"
                className="w-14 h-14 rounded-full shadow-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">
                UM Digos College
              </span>
              <span className="text-sm font-medium text-white/90 dark:text-white/80">
                Community Extension Center
              </span>
            </div>
          </div>

          {/* Main Content - Text colors updated */}
          <div className="flex flex-col flex-1 justify-center space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold tracking-tight leading-tight text-white">
                Welcome to CEC
                <br />
                Management System
              </h1>
              <p className="text-xl text-white/90 dark:text-white/80 max-w-[90%]">
                Streamlining UMDC's community extension programs and activities
                through efficient digital management.
              </p>
            </div>

            {/* System Features - Updated hover and background colors */}
            <div className="space-y-8">
              {[
                {
                  icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                  text: "Program Documentation",
                  description:
                    "Efficiently manage and track all extension programs",
                },
                {
                  icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z",
                  text: "Activity Analytics",
                  description:
                    "Monitor and analyze program impact and outcomes",
                },
                {
                  icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                  text: "Event Management",
                  description: "Schedule and coordinate community activities",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-6 items-start p-4 rounded-lg hover:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="p-3 rounded-lg bg-white/10 dark:bg-white/20">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={feature.icon}
                      />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">
                      {feature.text}
                    </h3>
                    <p className="text-sm text-white/75 dark:text-white/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative mt-12 text-sm text-white/60 dark:text-white/50">
            © {new Date().getFullYear()} UMDC Community Extension Center. All
            rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div
        className={cn(
          "flex flex-col flex-1 justify-center",
          "px-6 py-12 sm:px-8 lg:px-12"
        )}
      >
        <div className="mx-auto w-full max-w-[400px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
