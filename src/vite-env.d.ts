/// <reference types="vite/client" />

declare module '@vercel/analytics/react' {
  export interface AnalyticsProps {}
  export const Analytics: React.FC<AnalyticsProps>;
}