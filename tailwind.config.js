module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        /* Primary */
        primary: '#6A0DAD', // Deep Purple
        primaryHover: '#5B0BA0',
        lavender: '#CFA5FF',

        /* Neutrals */
        white: '#FFFFFF',
        lightGray: '#F5F5F5',
        mediumGray: '#A9A9A9',
        darkGray: '#333333',

        /* Accents */
        danger: '#FFB6C1', // Alerts
        success: '#00D1FF', // Success

        /* Dark Mode */
        darkBg: '#151128',
        darkCard: '#1F1B3A',
        darkBorder: '#2E2A4D',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #6A0DAD, #CFA5FF)',
        'gray-gradient': 'linear-gradient(135deg, #F5F5F5, #E0E0E0)',
      },
    },
  },
  plugins: [],
};

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ['./src/**/*.{html,ts}'],
//   theme: {
//     extend: {
//       colors: {
//         primary: '#5B2D8B',
//         secondary: '#9F7AEA',
//       },
//     },
//   },
//   plugins: [],
// };
// module.exports = {
//   darkMode: 'class',
//   theme: {
//     extend: {},
//   },
// };
