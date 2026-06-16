export function getWeatherInfo(code: number): { icon: string; label: string } {
  if (code === 0) {
    return { icon: "☀️", label: "Ensoleillé" };
  }

  if (code >= 1 && code <= 3) {
    return { icon: "🌤", label: "Partiellement nuageux" };
  }

  if (code >= 45 && code <= 48) {
    return { icon: "🌫", label: "Brouillard" };
  }

  if (code >= 51 && code <= 67) {
    return { icon: "🌧", label: "Pluie" };
  }

  if (code >= 71 && code <= 77) {
    return { icon: "❄️", label: "Neige" };
  }

  if (code >= 80 && code <= 82) {
    return { icon: "🌦", label: "Averses" };
  }

  if (code >= 95 && code <= 99) {
    return { icon: "⛈", label: "Orage" };
  }

  return { icon: "🌡", label: "Conditions variables" };
}
