/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    screens: {
      xs: "450px",
      sm: "575px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
    extend: {
      scrollbar: {
        width: {
          thin: '6px',
        },
        colors: {
          thumb: {
            DEFAULT: '#4f46e5',
            hover: '#3b82f6',
          },
          track: '#e5e7eb',
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-custom': {
          'scrollbar-width': 'thin',
          position: 'relative',
          zIndex: '10',
        },
        '.scrollbar-custom::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '.scrollbar-custom::-webkit-scrollbar-thumb': {
          background: '#4f46e5',
          'border-radius': '8px',
        },
        '.scrollbar-custom::-webkit-scrollbar-thumb:hover': {
          background: '#3b82f6',
        },
        '.scrollbar-custom::-webkit-scrollbar-track': {
          background: '#e5e7eb',
        },
      });
    },
  ],
};
