
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: string;
}

export interface LayoutField {
  id: string;
  type: 'input' | 'textarea' | 'select' | 'checkbox' | 'button';
  label: string;
  required?: boolean;
  visible: boolean;
  order: number;
  width: 'full' | 'half' | 'third';
}

export interface LayoutConfig {
  formFields: LayoutField[];
  dashboardCards: {
    id: string;
    name: string;
    visible: boolean;
    order: number;
    size: 'small' | 'medium' | 'large';
  }[];
}

export interface DesignSettings {
  activeTheme: string;
  layout: LayoutConfig;
  customThemes: Theme[];
}
