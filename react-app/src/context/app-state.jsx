import { createContext, useContext, useReducer, useMemo, useEffect } from "react";
import yaml from "js-yaml";

const AppStateContext = createContext(null);

const initialState = {
    availableThemes: [
        "a11yDark",
        "a11yLight",
        "agate",
        "anOldHope",
        "androidstudio",
        "arduinoLight",
        "arta",
        "ascetic",
        "atelierCaveDark",
        "atelierCaveLight",
        "atelierDuneDark",
        "atelierDuneLight",
        "atelierEstuaryDark",
        "atelierEstuaryLight",
        "atelierForestDark",
        "atelierForestLight",
        "atelierHeathDark",
        "atelierHeathLight",
        "atelierLakesideDark",
        "atelierLakesideLight",
        "atelierPlateauDark",
        "atelierPlateauLight",
        "atelierSavannaDark",
        "atelierSavannaLight",
        "atelierSeasideDark",
        "atelierSeasideLight",
        "atelierSulphurpoolDark",
        "atelierSulphurpoolLight",
        "atomOneDarkReasonable",
        "atomOneDark",
        "atomOneLight",
        "brownPaper",
        "codepenEmbed",
        "colorBrewer",
        "darcula",
        "dark",
        "defaultStyle",
        "docco",
        "dracula",
        "far",
        "foundation",
        "githubGist",
        "github",
        "gml",
        "googlecode",
        "gradientDark",
        "gradientLight",
        "grayscale",
        "gruvboxDark",
        "gruvboxLight",
        "hopscotch",
        "hybrid",
        "idea",
        "irBlack",
        "isblEditorDark",
        "isblEditorLight",
        "kimbieDark",
        "kimbieLight",
        "lightfair",
        "lioshi",
        "magula",
        "monoBlue",
        "monokaiSublime",
        "monokai",
        "nightOwl",
        "nnfxDark",
        "nnfx",
        "nord",
        "obsidian",
        "ocean",
        "paraisoDark",
        "paraisoLight",
        "pojoaque",
        "purebasic",
        "qtcreatorDark",
        "qtcreatorLight",
        "railscasts",
        "rainbow",
        "routeros",
        "schoolBook",
        "shadesOfPurple",
        "solarizedDark",
        "solarizedLight",
        "srcery",
        "stackoverflowDark",
        "stackoverflowLight",
        "sunburst",
        "tomorrowNightBlue",
        "tomorrowNightBright",
        "tomorrowNightEighties",
        "tomorrowNight",
        "tomorrow",
        "vs",
        "vs2015",
        "xcode",
        "xt256",
        "zenburn"
    ],
    theme: "tomorrowNightBright",
    bgColor: "#232323",
    config: null,         // parsed YAML object
    loadingConfig: false, // small example flag
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_AVAILABLE_THEMES":
      return { ...state, availableThemes: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_BACKGROUND_COLOR":
      return { ...state, bgColor: action.payload };
    case "SET_CONFIG":
      return { ...state, config: action.payload };
    case "SET_LOADING_CONFIG":
      return { ...state, loadingConfig: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(() => ({
    setAvailableTheme: (t) => dispatch({ type: "SET_AVAILABLE_THEMES", payload: t }),
    setTheme: (t) => dispatch({ type: "SET_THEME", payload: t }),
    setBgColor: (t) => dispatch({ type: "SET_BACKGROUND_COLOR", payload: t }),
    setConfig: (cfg) => dispatch({ type: "SET_CONFIG", payload: cfg }),
    setLoadingConfig: (v) => dispatch({ type: "SET_LOADING_CONFIG", payload: v }),
  }), []);

  // Load theme and bgColor from config on startup
  useEffect(() => {
    (async () => {
      try {
        const yamlText = await window.configAPI?.read();
        if (yamlText) {
          const config = yaml.load(yamlText);
          if (config?.theme) {
            actions.setTheme(config.theme);
          }
          if (config?.bgColor) {
            actions.setBgColor(config.bgColor);
          }
        }
      } catch (err) {
        console.error('Failed to load config:', err);
      }
    })();
  }, []);

  // Listen for theme changes from other windows
  useEffect(() => {
    if (!window.configAPI?.onThemeChange) return;
    
    window.configAPI.onThemeChange((newTheme) => {
      console.log('Theme changed from another window:', newTheme);
      actions.setTheme(newTheme);
    });
  }, []);

  // Listen for bgColor changes from other windows
  useEffect(() => {
    if (!window.configAPI?.onBgColorChange) return;
    
    window.configAPI.onBgColorChange((newBgColor) => {
      console.log('Background color changed from another window:', newBgColor);
      actions.setBgColor(newBgColor);
    });
  }, []);

  const value = useMemo(() => ({ state, ...actions }), [state, actions]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx; // { state, setTheme, setConfig, setLoadingConfig }
}
