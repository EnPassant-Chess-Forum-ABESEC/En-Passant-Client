import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden flex items-center justify-center">
      <div
        className="hidden md:block absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage: "url('/auth/auth_page_background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div
        className="relative z-10 flex w-full max-w-5xl mx-4 sm:mx-6 overflow-hidden"
        style={{
          minHeight: "600px",
          borderRadius: "2rem",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="hidden lg:block relative flex-1"
          style={{
            backgroundColor: "#050505",
            backgroundImage: "url('/common/dark_marble_bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Image
            src="/auth/login_signup_figure.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            style={{
              objectFit: "cover",
              objectPosition: "center 15%",
              transform: "scaleX(-1)",
              display: "block",
              mixBlendMode: "screen",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
              zIndex: 1,
            }}
          />
        </div>

        <div
          className="flex flex-col items-center justify-center w-full lg:w-[55%] flex-shrink-0 px-4 sm:px-8 py-10"
          style={{
            background: "rgba(10, 10, 10, 0.92)",
            backdropFilter: "blur(24px) saturate(150%)",
            WebkitBackdropFilter: "blur(24px) saturate(150%)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
