

export const fontSizeOptions = [
  { key: "small", label: "صغير", px: 14 },
  { key: "medium", label: "متوسط", px: 16 },
  { key: "large", label: "كبير", px: 18 },
];

const STORAGE_KEY = "fontSize";


export const getSavedFontSize = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  const isValid = fontSizeOptions.some((option) => option.key === saved);

  return isValid ? saved : "medium";
};


export const applyFontSize = (sizeKey) => {
  const option =
    fontSizeOptions.find((item) => item.key === sizeKey) || fontSizeOptions[1];

  document.documentElement.style.fontSize = `${option.px}px`;

  localStorage.setItem(STORAGE_KEY, option.key);
};
