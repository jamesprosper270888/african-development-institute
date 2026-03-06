export const projectConfig = {
  name: "African Development Institute",
  tagline: "From Surviving to Thriving",
  domain: process.env.NEXT_PUBLIC_DOMAIN || "localhost:3005",
  supportEmail: "hello@africandevelopmentinstitute.org",
  companyName: "Prospect Connect Media",

  features: {
    membership: true,
    leadershipProgramme: true,
    organisations: true,
    blog: false,
  },

  brand: {
    red: "#C8102E",
    black: "#1C1C1C",
    green: "#006B3F",
    offWhite: "#FAF8F5",
  },

  urls: {
    app: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005",
    marketing: process.env.NEXT_PUBLIC_MARKETING_URL || "http://localhost:3005",
  },
} as const;

export function isFeatureEnabled(
  feature: keyof typeof projectConfig.features
): boolean {
  return projectConfig.features[feature];
}
