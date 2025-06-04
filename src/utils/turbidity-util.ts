export const getQualityColor = (quality: number) => {
  switch (quality) {
    case 1:
      return { color: "text-error", text: "Ruim" };
    case 2:
      return { color: "text-warning", text: "Médio" };
    case 3:
      return { color: "text-success", text: "Boa" };
    default:
      return { color: "text-foreground", text: "Desconhecida" };
  }
};
