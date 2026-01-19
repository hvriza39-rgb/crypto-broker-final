/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 1. Point to src directory
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    
    // 2. Catch-all (Recommended) - this covers anything else you add to src later
    './src/**/*.{js,ts,jsx,tsx,mdx}', 
  ],
  theme: {
    extend: {
      colors: {
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        muted: '#9ca3af',
        // Add your background color here if you used "bg-bg" in your code
        bg: '#0b1220', 
      },
    },
  },
  plugins: [],
}