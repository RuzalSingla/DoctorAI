/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'pastel-bg': 'var(--background)',
        'pastel-text': 'var(--foreground)',
        'pastel-primary': 'var(--primary)',
        'pastel-secondary': 'var(--secondary)',
        'pastel-tertiary': 'var(--tertiary)',
        'pastel-muted': 'var(--muted)'
      },
      boxShadow: {
        'neon': 'var(--neon-shadow)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
}
