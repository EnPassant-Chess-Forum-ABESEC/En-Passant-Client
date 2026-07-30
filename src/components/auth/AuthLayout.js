import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage: "url('/signup_login_background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Right Figure Image */}
      <div
        className="absolute right-0 bottom-0 z-20 w-[60%] lg:w-[50%] max-w-[800px] h-[95%] pointer-events-none"
        style={{
          backgroundImage: "url('/login_signup_figure.png')",
          backgroundSize: "contain",
          backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-screen">
        {/* Left Text */}
        <div className="hidden lg:flex flex-col font-black text-[5rem] xl:text-[6rem] leading-[1.05] tracking-tight text-white drop-shadow-xl z-30">
          <span className="text-gray-100">Think.</span>
          <span className="text-[#d30000]">Move.</span>
          <span className="text-gray-100">Conquer.</span>
        </div>

        <div className="w-full lg:w-[400px] flex justify-center z-30 lg:absolute lg:left-[45%] xl:left-1/2 lg:-translate-x-1/2">
          {children}
        </div>
      </div>
    </div>
  );
}
