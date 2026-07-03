import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        clinical: {
          ink: "#10212b",
          teal: "#0f766e",
          blue: "#2563eb",
          mint: "#dff7f0",
          surface: "#f7fafc"
        }
      },
      borderRadius: {
        card: "8px"
      }
    }
  },
  plugins: []
} satisfies Config;
