/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      boxShadow: {
        // Create a massive custom shadow
        "3xl": "0px 20px 40px rgba(0, 0, 0, 0.5)",
      },
      elevation: {
        // Android relies on elevation, so add a custom one here!
        "3xl": "30",
      },
    },
  },
  plugins: [],
};
