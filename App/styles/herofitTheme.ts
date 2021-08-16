export default {
  components: {
    Button: {
      // Can simply pass default props to change default behavior of components.
      // baseStyle on buttons doesn't seem to work!
      baseStyle: {
        rounded: 'md',
        bg: 'base.water',
        // _text: {
        //   color: 'base.primary',
        // },
        marginLeft: 2,
        marginRight: 2,
        _disabled:{
          opacity:1,
          backgroundColor:'primary.600',
          // Doesn't work!
          // _text: {
          //   color : 'fire.500'
          // }
          
        }
      },
      // defaultProps works
      defaultProps: {
        colorScheme: 'buttonPrimary',
      },
      variants: {
        secondary: {
          bg: `muted.200`,
          _text: {
            color: 'base.success',
          },
          border: 1,
          borderColor: 'base.success'
        },
        warning: {
          bg: `buttonWarning.200`,
        },
      },
    },
    Input: {
      baseStyle: {
        backgroundColor: 'base.white',
      },
      defaultProps: {
        shadow : 1
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: 'heading',
        fontSize: 100
      },
    },
    Link:{
      baseStyle: {
        _text: {color: "base.link"},
      },

    },
    // Box : {
    //   baseStyle: {
    //     backgroundColor : '#E7EDDF'
    //   }
    // }
    View:{
      variants: {
        pane: {
          bg: `primary.200`,
          padding: 3,
          shadow: 5,
          marginLeft: 2,
          marginRight: 2,
          borderTopColor : 'base.white',
          borderTopWidth : 1,
          borderRightColor : 'base.white',
          borderRightWidth : 1
        },
      }
    }
  },
  colors: {
    // Add new color
    primary: { 50: '#f9f9f9', 100: '#ededed', 200: '#e1e1e0', 300: '#d3d3d3', 400: '#c4c4c3', 500: '#b3b3b3', 600: '#a0a09f', 700: '#898988', 800: '#6c6c6b', 900: '#242423'},
    brand: { 50: '#f8fbed', 100: '#e7f3c6', 200: '#d6e99a', 300: '#c1df69', 400: '#abd236', 500: '#d4af37', 600: '#8cab2c', 700: '#789326', 800: '#5f741e', 900: '#374412'},
    earth: { 50: '#faf9f5', 100: '#f0eee1', 200: '#e6e1cc', 300: '#dad3b4', 400: '#cec49a', 500: '#c0b37d', 600: '#afa05c', 700: '#9c8834', 800: '#806a0e', 900: '#8A360F'},
    fire: { 50: '#fdf9ee', 100: '#f8edca', 200: '#f3e0a3', 300: '#edd176', 400: '#e6c043', 500: '#d9ae21', 600: '#c29b1d', 700: '#a68519', 800: '#e25822', 900: '#4d3e0c'},
    water: { 50: '#f7fafc', 100: '#e6eff5', 200: '#d5e3ed', 300: '#c1d6e5', 400: '#acc7dd', 500: '#94b7d3', 600: '#78a5c7', 700: '#568eb9', 800: '#0f5e9c', 900: '#0a426c'},
    air: { 50: '#f8f9ff', 100: '#eaedfe', 200: '#dbdffd', 300: '#cad1fd', 400: '#b7c0fc', 500: '#a2aefb', 600: '#16a0f5', 700: '#6b7ef9', 800: '#4159f7', 900: '#1027b7'},
    aether : { 50: '#FFFFC2', 100: '#f1f1b7', 200: '#e4e4ad', 300: '#d6d6a3', 400: '#c7c797', 500: '#b6b68a', 600: '#a2a27b', 700: '#8b8b6a', 800: '#6e6e53', 900: '#404031'},
    buttonPrimary : { 50: '#356735', 100: '#356735', 200: '#356735', 300: '#356735', 400: '#356735', 500: '#356735', 600: '#356735', 700: '#356735', 800: '#356735', 900: '#356735'},
    buttonWarning : { 50: '#BF0000', 100: '#BF0000', 200: '#BF0000', 300: '#BF0000', 400: '#BF0000', 500: '#ff6700', 600: '#BF0000', 700: '#BF0000', 800: '#BF0000', 900: '#BF0000'},
    base : { 'primary':'#242423', 'background':'#E7EDDF', 'white':'#ffffff', 'warning':'#BF0000', 'caution':'#ff6700', 'disabled':'#212121', 'success':'#356735', 'highlight':'#f1c85b', 'brand':'#d4af37', 'fire':'#e25822', 'earth':'#8A360F', 'water':'#0f5e9c', 'air':'#16a0f5', 'aether':'#FFFFC2', 'link': '#3792cb', 'health':'#A30216', 'armor':'#242130', 'power':'#5f5f5f', 'recovery':'356735', 'timber_terror':'#3D2A18', 'repete':'#9B9B9B', 'filtron_five':'#EBEBEB', 'chrono_guy':'#4B4B4B', 'solar_celeste':'#EBDD49', 'wilhelm_the_wild':'#533B27', 'natural_ninja':'#0C2613', 'empath_aurelia':'#B9AF73', 'boulder_bro':'#986634', 'compost_creature':'#796D20' },
  },
  fonts: {
    heading: 'bebas-neue',
    body: 'oswald',
    cursive:'rochester',
    icomoon:'icomoon',
    systemFont: 'sans-serif-condensed'
  },

};