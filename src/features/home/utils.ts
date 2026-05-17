export type Greeting = {
  text: string;
  emoji: string;
};

export function getGreeting(now = new Date()): Greeting {
  const h = now.getHours();
  if (h >= 5 && h < 11) return { text: "Good Morning", emoji: "🌅" };
  if (h >= 11 && h < 17) return { text: "Good Afternoon", emoji: "☀️" };
  if (h >= 17 && h < 23) return { text: "Good Evening", emoji: "🌙" };
  return { text: "Late Night", emoji: "✨" };
}

export function formatDate(now = new Date(), lang: "ja" | "en" = "en"): string {
  if (lang === "ja") {
    return new Intl.DateTimeFormat("ja-JP", { dateStyle: "long" }).format(now);
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now);
}
