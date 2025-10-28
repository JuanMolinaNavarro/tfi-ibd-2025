export function cn(...values) {
  return values
    .flatMap((value) => {
      if (typeof value === "string") return value.split(" ");
      if (Array.isArray(value)) return value;
      if (typeof value === "object" && value !== null) {
        return Object.entries(value)
          .filter(([, active]) => Boolean(active))
          .map(([key]) => key);
      }
      return [];
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

