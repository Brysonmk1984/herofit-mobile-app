export default {
  components: {
    Button: {
      // Can simply pass default props to change default behavior of components.
      // baseStyle on buttons doesn't seem to work!
      baseStyle: {
        rounded: "md",
        bg: "base.water",
        marginLeft: 2,
        marginRight: 2,

        //DOESNT WORK
        // _disabled: {
        //   opacity: 1,
        //   backgroundColor: "base.disabled",
        //   // color: "#555554",
        //   // _text: {
        //   //   color: "#555554",
        //   // },
        // },
        // _text: {
        //   color: 'base.primary',
        // },
      },
      // DOESN't WORK
      _disabled: {
        opacity: 1,
        backgroundColor: "base.disabled",
        // color: "#555554",
        // _text: {
        //   color: "#555554",
        // },
      },

      // defaultProps works
      defaultProps: {
        colorScheme: "buttonPrimary",
        py: 3,
        _pressed: {
          backgroundColor: "success.300",
        },
        _text: {
          fontSize: "2xl",
          fontFamily: "bebas-neue",
        },
      },
      variants: {
        secondary: {
          bg: `muted.200`,
          _text: {
            color: "base.success",
          },
          border: 1,
          borderColor: "base.success",
        },
        caution: {
          bg: `buttonWarning.200`,
        },
      },
    },
    Toast: {
      baseStyle: {
        width: "100%",
        flex: 1,
        margin: 0,
      },
      variants: {
        test: {
          backgroundColor: "black",
          _text: {
            color: "base.white",
          },
        },
      },
    },
    Divider: {
      baseStyle: {
        bg: "base.brand",
      },
      variants: {
        subheaderDivider: {
          mt: 3,
          mb: 3,
        },
        statDivider: {
          mt: 0,
          mb: 0,
          py: 0,
        },
      },
    },
    FormControl: {},
    Heading: {
      baseStyle: {
        fontFamily: "heading",
        fontSize: 100,
      },
    },
    Input: {
      baseStyle: {
        backgroundColor: "base.white",
        _invalid: {
          color: "base.caution",
        },
      },
      defaultProps: {
        shadow: 1,
        fontSize: "xl",
      },
    },
    Link: {
      baseStyle: {
        _text: { color: "base.link" },
      },
    },
    View: {
      variants: {
        pane: {
          bg: `primary.50`,
          padding: 3,
          shadow: 5,
          marginLeft: 2,
          marginRight: 2,
          borderColor: "base.brand",
          borderWidth: 1,
        },
        transparent: {
          padding: 0,
          marginLeft: 1,
          marginRight: 1,
        },
      },
    },
    VStack: {
      baseStyle: {
        space: 6,
      },
    },
  },
  colors: {
    // Add new color
    primary: { 50: "#f9f9f9", 100: "#ededed", 200: "#e1e1e0", 300: "#d3d3d3", 400: "#c4c4c3", 500: "#b3b3b3", 600: "#a0a09f", 700: "#898988", 800: "#6c6c6b", 900: "#242423" },
    brand: { 50: "#f8fbed", 100: "#e7f3c6", 200: "#d6e99a", 300: "#c1df69", 400: "#abd236", 500: "#d4af37", 600: "#8cab2c", 700: "#789326", 800: "#5f741e", 900: "#374412" },
    earth: { 50: "#faf9f5", 100: "#f0eee1", 200: "#e6e1cc", 300: "#dad3b4", 400: "#cec49a", 500: "#c0b37d", 600: "#afa05c", 700: "#923D15", 800: "#806a0e", 900: "#8A360F" },
    fire: { 50: "#fdf9ee", 100: "#f8edca", 200: "#f3e0a3", 300: "#edd176", 400: "#e6c043", 500: "#d9ae21", 600: "#E6C026", 700: "#E66A28", 800: "#e25822", 900: "#4d3e0c" },
    water: { 50: "#f7fafc", 100: "#e6eff5", 200: "#d5e3ed", 300: "#c1d6e5", 400: "#acc7dd", 500: "#94b7d3", 600: "#78a5c7", 700: "#1363A1", 800: "#0f5e9c", 900: "#0a426c" },
    air: { 50: "#f8f9ff", 100: "#eaedfe", 200: "#dbdffd", 300: "#cad1fd", 400: "#b7c0fc", 500: "#a2aefb", 600: "#16a0f5", 700: "#2AA9F8", 800: "#4159f7", 900: "#1027b7" },
    aether: { 50: "#FFFFC2", 100: "#f1f1b7", 200: "#e4e4ad", 300: "#d6d6a3", 400: "#c7c797", 500: "#b6b68a", 600: "#a2a27b", 700: "#8b8b6a", 800: "#6e6e53", 900: "#404031" },
    health: { 50: "rgba(0,0,0,.2)", 100: "rgba(0,0,0,.2)", 200: "rgba(0,0,0,.2)", 300: "rgba(0,0,0,.2)", 400: "rgba(0,0,0,.2)", 500: "#A42420", 600: "#A42420", 700: "#A42420", 800: "#A42420", 900: "#A42420" },
    xp: { 50: "rgba(0,0,0,.2)", 100: "rgba(0,0,0,.2)", 200: "rgba(0,0,0,.2)", 300: "rgba(0,0,0,.2)", 400: "rgba(0,0,0,.2)", 500: "#6c6c6b", 600: "#6c6c6b", 700: "#6c6c6b", 800: "#6c6c6b", 900: "#6c6c6b" },
    buttonPrimary: { 50: "#356735", 100: "#356735", 200: "#356735", 300: "#356735", 400: "#356735", 500: "#356735", 600: "#356735", 700: "#356735", 800: "#356735", 900: "#356735" },
    buttonWarning: { 50: "#BF0000", 100: "#BF0000", 200: "#BF0000", 300: "#BF0000", 400: "#BF0000", 500: "#ff6700", 600: "#BF0000", 700: "#BF0000", 800: "#BF0000", 900: "#BF0000" },
    caution: { 50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12" },
    base: {
      primary: "#2b2b2a",
      primaryAlt: "#383837",
      secondary: "#333633",
      background: "#E7EDDF",
      white: "#ffffff",
      black: "#000000",
      textShadowColor: "rgba(36, 36, 35, 0.75)",
      info: "#16a0f5",
      error: "#BF0000",
      caution: "#ff6700",
      success: "#356735",
      disabled: "#555554",
      disabledText: "#6c6c6b",
      highlight: "#f1c85b",
      highlightTransparent: "rgba(255,255,240, .6)",
      highlightMoreTransparent: "rgba(255,255,240, .4)",
      lowlight: "#1d0e29",
      brand: "#d4af37",
      strava: "#FC4C02",
      fire: "#e25822",
      earth: "#8A360F",
      water: "#0f5e9c",
      air: "#16a0f5",
      aether: "#FFFFC2",
      all: "#e1e1e0",
      workout: "#a0a09f",
      other: "#a0a09f",
      link: "#3792cb",
      health: "#A30216",
      armor: "#242130",
      power: "#303030",
      recovery: "#356735",
      timber_terror: "#3D2A18",
      repete: "#9B9B9B",
      filtron_five: "#EBEBEB",
      chrono_guy: "#4B4B4B",
      solar_celeste: "#EBDD49",
      wilhelm_the_wild: "#533B27",
      natural_ninja: "#0C2613",
      empath_aurelia: "#7D0110",
      boulder_bro: "#986634",
      compost_creature: "#796D20",
      consumable: "#b91c1c",
      pet: "#40E0D0",
      skin: "#7e22ce",
      title: "#f97316",
      codex: "#9d174d",
      transparent: "rgba(255,255,255,0)",
      lightTransparent: "rgba(255,255,255,.5)",
      darkTransparent: "rgba(0,0,0,.6)",
      qp: "#C889FF",
      pt: "#DECC24",
    },
    layout: { modalBackdrop: "rgba(0,0,0,1)" },
  },
  fonts: {
    heading: "bebas-neue",
    body: "oswald",
    handwriting: "shadowsIntoLight",
    icomoon: "icomoon",
    systemFont: "sans-serif-condensed",
  },
  shadow: {
    0: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 0.5,
      elevation: 1,
    },
    1: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    2: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    3: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    4: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    5: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    6: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
    },
    7: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    8: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 9,
    },
    9: {
      shadowColor: "#fff",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
    },
  },
};
