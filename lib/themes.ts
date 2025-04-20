// Theme definitions for user profiles

export interface ThemeColors {
  background: string
  text: string
  primary: string
  secondary: string
  accent: string
  buttonText: string
  buttonBackground: string
  buttonHover: string
}

export interface ThemeOption {
  id: string
  name: string
  description: string
  colors: ThemeColors
  fontFamily: string
  buttonStyle: string
  cardStyle: string
  backgroundType: "solid" | "gradient" | "pattern"
  backgroundCSS: string
  previewImage?: string
}

// Define our theme options
export const themeOptions: ThemeOption[] = [
  {
    id: "default",
    name: "Default",
    description: "Clean and minimal design",
    colors: {
      background: "bg-white dark:bg-gray-900",
      text: "text-gray-900 dark:text-gray-100",
      primary: "text-primary",
      secondary: "text-gray-500 dark:text-gray-400",
      accent: "text-primary",
      buttonText: "text-white",
      buttonBackground: "bg-primary",
      buttonHover: "hover:bg-primary/90",
    },
    fontFamily: "font-sans",
    buttonStyle: "rounded-md",
    cardStyle: "bg-white dark:bg-gray-800 shadow-sm",
    backgroundType: "solid",
    backgroundCSS: "bg-white dark:bg-gray-900",
  },
  {
    id: "dark",
    name: "Dark Mode",
    description: "Sleek dark interface",
    colors: {
      background: "bg-gray-900",
      text: "text-white",
      primary: "text-blue-400",
      secondary: "text-gray-400",
      accent: "text-blue-400",
      buttonText: "text-white",
      buttonBackground: "bg-blue-600",
      buttonHover: "hover:bg-blue-700",
    },
    fontFamily: "font-sans",
    buttonStyle: "rounded-md",
    cardStyle: "bg-gray-800 shadow-md",
    backgroundType: "solid",
    backgroundCSS: "bg-gray-900",
  },
  {
    id: "gradient-purple",
    name: "Purple Gradient",
    description: "Vibrant purple gradient background",
    colors: {
      background: "bg-gradient-to-br from-purple-500 to-pink-500",
      text: "text-white",
      primary: "text-white",
      secondary: "text-gray-200",
      accent: "text-yellow-300",
      buttonText: "text-white",
      buttonBackground: "bg-white/20 backdrop-blur-sm border border-white/30",
      buttonHover: "hover:bg-white/30",
    },
    fontFamily: "font-sans",
    buttonStyle: "rounded-xl",
    cardStyle: "bg-white/10 backdrop-blur-sm border border-white/20",
    backgroundType: "gradient",
    backgroundCSS: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
  {
    id: "gradient-blue",
    name: "Ocean Blue",
    description: "Calming blue gradient",
    colors: {
      background: "bg-gradient-to-br from-blue-500 to-teal-400",
      text: "text-white",
      primary: "text-white",
      secondary: "text-blue-100",
      accent: "text-yellow-300",
      buttonText: "text-white",
      buttonBackground: "bg-white/20 backdrop-blur-sm border border-white/30",
      buttonHover: "hover:bg-white/30",
    },
    fontFamily: "font-sans",
    buttonStyle: "rounded-xl",
    cardStyle: "bg-white/10 backdrop-blur-sm border border-white/20",
    backgroundType: "gradient",
    backgroundCSS: "bg-gradient-to-br from-blue-500 to-teal-400",
  },
  {
    id: "neon",
    name: "Neon",
    description: "Vibrant neon theme with dark background",
    colors: {
      background: "bg-black",
      text: "text-white",
      primary: "text-green-400",
      secondary: "text-purple-400",
      accent: "text-pink-500",
      buttonText: "text-black",
      buttonBackground: "bg-green-400",
      buttonHover: "hover:bg-green-300",
    },
    fontFamily: "font-mono",
    buttonStyle: "rounded-none border-2 border-green-400",
    cardStyle: "bg-gray-900 border-2 border-green-400",
    backgroundType: "solid",
    backgroundCSS: "bg-black",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-minimal design with focus on content",
    colors: {
      background: "bg-gray-50 dark:bg-gray-950",
      text: "text-gray-900 dark:text-gray-100",
      primary: "text-gray-900 dark:text-gray-100",
      secondary: "text-gray-500 dark:text-gray-400",
      accent: "text-gray-900 dark:text-gray-100",
      buttonText: "text-gray-900 dark:text-gray-100",
      buttonBackground: "bg-transparent",
      buttonHover: "hover:bg-gray-200 dark:hover:bg-gray-800",
    },
    fontFamily: "font-sans",
    buttonStyle: "rounded-none border border-gray-200 dark:border-gray-700",
    cardStyle: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
    backgroundType: "solid",
    backgroundCSS: "bg-gray-50 dark:bg-gray-950",
  },
  {
    id: "retro",
    name: "Retro",
    description: "Vintage-inspired design",
    colors: {
      background: "bg-amber-50",
      text: "text-amber-900",
      primary: "text-amber-800",
      secondary: "text-amber-700",
      accent: "text-red-600",
      buttonText: "text-amber-50",
      buttonBackground: "bg-amber-800",
      buttonHover: "hover:bg-amber-700",
    },
    fontFamily: "font-serif",
    buttonStyle: "rounded-md border-2 border-amber-800",
    cardStyle: "bg-amber-100 border-2 border-amber-800",
    backgroundType: "pattern",
    backgroundCSS: "bg-amber-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]",
  },
  {
    id: "nature",
    name: "Nature",
    description: "Earthy tones inspired by nature",
    colors: {
      background: "bg-gradient-to-br from-green-800 to-green-600",
      text: "text-white",
      primary: "text-amber-200",
      secondary: "text-green-100",
      accent: "text-amber-400",
      buttonText: "text-green-900",
      buttonBackground: "bg-amber-200",
      buttonHover: "hover:bg-amber-300",
    },
    fontFamily: "font-sans",
    buttonStyle: "rounded-full",
    cardStyle: "bg-white/10 backdrop-blur-sm border border-white/20",
    backgroundType: "gradient",
    backgroundCSS: "bg-gradient-to-br from-green-800 to-green-600",
  },
]

// Get a theme by ID
export function getThemeById(themeId: string): ThemeOption {
  return themeOptions.find((theme) => theme.id === themeId) || themeOptions[0]
}

// Get button style based on theme and link type
export function getButtonStyle(theme: ThemeOption, linkType: string, isPublic: boolean): string {
  if (!isPublic) {
    return `${theme.buttonStyle} bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400`
  }

  switch (theme.id) {
    case "default":
      switch (linkType) {
        case "instagram":
          return `${theme.buttonStyle} bg-gradient-to-r from-purple-500 to-pink-500 text-white`
        case "website":
          return `${theme.buttonStyle} ${theme.colors.buttonBackground} ${theme.colors.buttonText}`
        case "whatsapp":
          return `${theme.buttonStyle} bg-green-500 text-white`
        case "youtube":
          return `${theme.buttonStyle} bg-red-500 text-white`
        case "linkedin":
          return `${theme.buttonStyle} bg-blue-700 text-white`
        default:
          return `${theme.buttonStyle} ${theme.colors.buttonBackground} ${theme.colors.buttonText}`
      }

    case "minimal":
      return `${theme.buttonStyle} ${theme.colors.buttonBackground} ${theme.colors.buttonText} ${theme.colors.buttonHover}`

    case "neon":
      switch (linkType) {
        case "instagram":
          return `${theme.buttonStyle} bg-pink-500 text-white border-pink-500`
        case "youtube":
          return `${theme.buttonStyle} bg-red-500 text-white border-red-500`
        case "whatsapp":
          return `${theme.buttonStyle} bg-green-500 text-white border-green-500`
        case "linkedin":
          return `${theme.buttonStyle} bg-blue-600 text-white border-blue-600`
        default:
          return `${theme.buttonStyle} ${theme.colors.buttonBackground} ${theme.colors.buttonText}`
      }

    default:
      return `${theme.buttonStyle} ${theme.colors.buttonBackground} ${theme.colors.buttonText} ${theme.colors.buttonHover}`
  }
}
