module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        /* Primary Brand */
        primary: '#491F8D', // Deep Purple (Brand)
        primaryHover: '#3F197A',
        lavender: '#CFA5FF',
        /* Neutrals */
        white: '#FFFFFF',
        lightGray: '#F5F5F5',
        mediumGray: '#A9A9A9',
        darkGray: '#333333',

        /* Accents */
        success: '#00D1FF',
        danger: '#FF5A5F',

        /* Dark Mode */
        darkBg: '#0F0B1A',
        darkCard: '#1A1428',
        darkBorder: '#2E2A4D',

        /* Dark Mode Actions */
        darkPrimary: '#8A6DFF',
        darkSecondary: '#BFAFFF',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #491F8D, #CFA5FF)',
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
