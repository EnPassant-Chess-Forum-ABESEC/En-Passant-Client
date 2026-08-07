import { dark } from "@clerk/themes";

export const glassAppearance = {
  baseTheme: dark,
  elements: {
    rootBox: {
      width: "100%",
      maxWidth: "450px",
    },

    // cardBox and card are transparent — the glass shell is owned by auth/layout.js
    cardBox: {
      width: "100%",
      background: "transparent",
      border: "none",
      boxShadow: "none",
    },

    card: {
      background: "transparent",
      border: "none",
      boxShadow: "none",
      padding: "1.5rem 2rem",
      width: "100%",
    },

    headerTitle: {
      color: "#ffffff",
      fontSize: "1.5rem",
      fontWeight: "700",
    },
    headerSubtitle: {
      color: "#d1d5db",
    },

    socialButtonsBlockButton: {
      border: "1px solid rgba(255, 255, 255, 0.2)",
      color: "#ffffff",
      background: "rgba(255, 255, 255, 0.05)",
      transition: "background 0.2s, border-color 0.2s",
    },
    socialButtonsBlockButtonText: {
      color: "#ffffff",
      fontWeight: "500",
    },

    dividerLine: {
      background: "rgba(255, 255, 255, 0.2)",
    },
    dividerText: {
      color: "#9ca3af",
    },

    formFieldLabel: {
      color: "#d1d5db",
    },
    formFieldInput: {
      background: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      color: "#ffffff",
      transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
    },
    formFieldInput__focus: {
      borderColor: "rgba(211, 0, 0, 0.6)",
      boxShadow: "0 0 0 2px rgba(211, 0, 0, 0.2)",
      background: "rgba(255, 255, 255, 0.08)",
    },

    formButtonPrimary: {
      background: "#d30000",
      color: "#ffffff",
      fontWeight: "600",
      boxShadow: "0 4px 16px rgba(211,0,0,0.35)",
      transition: "background 0.2s",
    },

    footerActionText: {
      color: "#9ca3af",
    },
    footerActionLink: {
      color: "#d30000",
    },

    identityPreviewText: {
      color: "#d1d5db",
    },
    identityPreviewEditButtonIcon: {
      color: "#d30000",
    },

    formResendCodeLink: {
      color: "#d30000",
    },
    otpCodeFieldInput: {
      background: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      color: "#ffffff",
    },

    // Footer — fully transparent so it blends into the cardBox glass
    cardFooter: {
      background: "transparent",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    },
    cardFooterAction: {
      background: "transparent",
    },
    footer: {
      background: "transparent",
    },
    footerPages: {
      background: "transparent",
    },
    footerPagesLink: {
      color: "rgba(255,255,255,0.4)",
    },
    badge: {
      background: "rgba(255,255,255,0.07)",
      color: "rgba(255,255,255,0.5)",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    logoBox: {
      filter: "brightness(0) invert(0.5)",
    },
  },
};

export const userButtonAppearance = {
  baseTheme: dark,
  variables: {
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255, 255, 255, 0.5)",
  },
  elements: {
    // Glass card — increased transparency so glassmorphism is more visible
    userButtonPopoverCard: {
      background: "rgba(20, 20, 20, 0.5) !important",
      backdropFilter: "blur(20px) !important",
      WebkitBackdropFilter: "blur(20px) !important",
      border: "1px solid rgba(255, 255, 255, 0.08) !important",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5) !important",
      borderRadius: "16px !important",
    },
    userButtonPopoverMain: {
      background: "transparent !important",
    },
    // User name at top
    userPreviewMainIdentifier: {
      color: "#ffffff !important",
      fontWeight: "600 !important",
    },
    userPreviewSecondaryIdentifier: {
      color: "rgba(255, 255, 255, 0.5) !important",
    },
    // Thin divider line
    userButtonPopoverActionButtonsSeparator: {
      background: "rgba(255, 255, 255, 0.08) !important",
    },
    // All action button rows (built-in + custom Profile link)
    userButtonPopoverActionButton: {
      color: "#ffffff !important",
      borderRadius: "8px !important",
      background: "transparent !important",
      "&:hover": {
        background: "transparent !important",
      },
    },
    // Text label on every row (including Profile custom link)
    userButtonPopoverActionButtonText: {
      color: "#ffffff !important",
    },
    // Icon on every row
    userButtonPopoverActionButtonIconBox: {
      color: "#ffffff !important",
      "& > svg": {
        color: "#ffffff !important",
      },
    },
    // Footer
    userButtonPopoverFooter: {
      borderTop: "1px solid rgba(255, 255, 255, 0.06) !important",
      background: "transparent !important",
    },
  },
};

export const userProfileAppearance = {
  baseTheme: dark,
  variables: {
    colorBackground: "#111111",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255, 255, 255, 0.5)",
    colorInputBackground: "rgba(255, 255, 255, 0.05)",
    colorInputText: "#ffffff",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: {
      background: "transparent",
    },
    cardBox: {
      background: "#111111",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
      borderRadius: "16px",
    },
    navbar: {
      background: "#0d0d0d",
      borderRight: "1px solid rgba(255, 255, 255, 0.07)",
    },
    navbarButton: {
      color: "rgba(255, 255, 255, 0.6) !important",
      borderRadius: "8px !important",
    },
    navbarButtonActive: {
      background: "rgba(194, 24, 24, 0.15) !important",
      color: "#ffffff !important",
      fontWeight: "600 !important",
    },
    navbarButtonIcon: {
      color: "inherit !important",
    },
    pageScrollBox: {
      background: "#111111",
    },
    page: {
      background: "#111111",
    },
    profileSectionTitle: {
      color: "#ffffff !important",
      borderBottom: "1px solid rgba(255,255,255,0.07) !important",
    },
    profileSectionTitleText: {
      color: "#ffffff !important",
    },
    profileSectionContent: {
      color: "rgba(255,255,255,0.8) !important",
    },
    userPreviewMainIdentifier: {
      color: "#ffffff !important",
      fontWeight: "600 !important",
    },
    userPreviewSecondaryIdentifier: {
      color: "rgba(255, 255, 255, 0.5) !important",
    },
    profileSectionPrimaryButton: {
      color: "#ffffff !important",
      border: "1px solid rgba(255,255,255,0.2) !important",
      background: "transparent !important",
    },
    formFieldLabel: {
      color: "rgba(255, 255, 255, 0.7) !important",
    },
    formFieldInput: {
      background: "rgba(255, 255, 255, 0.05) !important",
      border: "1px solid rgba(255, 255, 255, 0.15) !important",
      color: "#ffffff !important",
    },
    formButtonPrimary: {
      background: "#c21818 !important",
      color: "#ffffff !important",
      fontWeight: "600 !important",
      boxShadow: "0 4px 16px rgba(194,24,24,0.35) !important",
    },
    formButtonReset: {
      color: "rgba(255,255,255,0.5) !important",
    },
    badge: {
      background: "rgba(255,255,255,0.07) !important",
      color: "rgba(255,255,255,0.6) !important",
      border: "1px solid rgba(255,255,255,0.12) !important",
    },
    menuButton: {
      color: "rgba(255,255,255,0.5) !important",
    },
    menuList: {
      background: "#1a1a1a !important",
      border: "1px solid rgba(255,255,255,0.1) !important",
    },
    menuItem: {
      color: "rgba(255,255,255,0.8) !important",
    },
    footer: {
      background: "#0d0d0d !important",
      borderTop: "1px solid rgba(255,255,255,0.06) !important",
    },
    footerPagesLink: {
      color: "rgba(255,255,255,0.3) !important",
    },
    logoBox: {
      filter: "brightness(0) invert(0.4)",
    },
  },
};
