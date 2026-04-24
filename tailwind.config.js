// module.exports = {
//   darkMode: 'class',
//   content: ['./src/**/*.{html,ts}'],
//   theme: {
//     extend: {
//       colors: {
//         /* Primary Brand */
//         primary: '#491F8D',
//         primaryHover: '#3F197A',
//         lavender: '#CFA5FF',

//         /* Neutrals */
//         white: '#FFFFFF',
//         lightGray: '#F5F5F5',
//         mediumGray: '#A9A9A9',
//         darkGray: '#333333',

//         /* Accents */
//         success: '#00D1FF',
//         danger: '#FF5A5F',

//         /* Dark Mode */
//         darkBg: '#0F0B1A',
//         darkCard: '#1A1428',
//         darkBorder: '#2E2A4D',

//         /* Dark Mode Actions */
//         darkPrimary: '#8A6DFF',
//         darkSecondary: '#BFAFFF',
//       },

//       backgroundImage: {
//         'primary-gradient': 'linear-gradient(135deg, #491F8D, #CFA5FF)',
//         'gray-gradient': 'linear-gradient(135deg, #F5F5F5, #E0E0E0)',
//       },

//       /* ✅ ANIMATION FIX */
//       animation: {
//         'nav-pop': 'navPop 0.2s ease-out',
//       },
//       keyframes: {
//         navPop: {
//           '0%': { transform: 'scale(1)' },
//           '100%': { transform: 'scale(1.05)' },
//         },
//       },
//     },
//   },
//   plugins: [],
// };

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        /* Primary Brand */
        primary: '#491F8D',
        primaryHover: '#3F197A',
        lavender: '#CFA5FF',

        /* Neutrals */
        white: '#FFFFFF',

        /* ✅ الصفحة */
        pageBg: '#FFFFFF',

        /* ✅ الكروت + سايد بار + تيبل */
        cardGray: '#F5F5F5',

        /* borders */
        borderGray: '#E5E7EB',

        mediumGray: '#A9A9A9',
        darkGray: '#333333',

        success: '#00D1FF',
        danger: '#FF5A5F',

        /* Dark Mode */
        darkBg: '#0F0B1A',
        darkCard: '#1A1428',
        darkBorder: '#2E2A4D',

        darkPrimary: '#8A6DFF',
        darkSecondary: '#BFAFFF',
      },
      /* ✅ ANIMATION FIX */
      animation: {
        'nav-pop': 'navPop 0.2s ease-out',
      },
      keyframes: {
        navPop: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};
