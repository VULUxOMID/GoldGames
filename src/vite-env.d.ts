/// <reference types="vite/client" />

declare module '@vercel/analytics/react' {
  export interface AnalyticsProps {}
  export const Analytics: React.FC<AnalyticsProps>;
}

declare module '@vercel/speed-insights/react' {
  export interface SpeedInsightsProps {}
  export const SpeedInsights: React.FC<SpeedInsightsProps>;
}