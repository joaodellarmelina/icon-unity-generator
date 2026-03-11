const translations = {
  "pt-BR": {
    title: "Unity Icon Generator",
    subtitle: "Envie uma imagem quadrada com no mínimo 1024x1024 para gerar apenas os ícones que você precisa.",
    dropTitle: "Arraste sua imagem aqui",
    dropText: "ou clique para selecionar",
    fileHint: "PNG, JPG ou WEBP • mínimo 1024x1024",
    selectImages: "Selecione quais imagens gerar",
    selectAll: "Selecionar tudo",
    androidVariants: "Variantes do Android",
    preview: "Pré-visualização",
    processing: "Processando imagem...",
    generate: "Gerar ícones",
    clear: "Limpar",
    ios: "iOS",
    android: "Android",
    windows: "Windows",
    api26: "API 26",
    api25: "API 25 & Legacy",
    invalidFormat: "Formato inválido. Use PNG, JPG ou WEBP.",
    selectImage: "Selecione uma imagem antes de continuar.",
    selectPlatform: "Selecione pelo menos uma plataforma.",
    selectVariant: "Selecione pelo menos uma variante do Android.",
    uploading: "Enviando imagem...",
    success: "Ícones gerados com sucesso. O download foi iniciado.",
    connectionError: "Erro de conexão com o servidor.",
    previewAlt: "Pré-visualização da imagem selecionada",
    processingError: "Erro ao processar a imagem."
  },
  en: {
    title: "Unity Icon Generator",
    subtitle: "Upload a square image with at least 1024x1024 to generate only the icons you need.",
    dropTitle: "Drag your image here",
    dropText: "or click to select",
    fileHint: "PNG, JPG or WEBP • minimum 1024x1024",
    selectImages: "Select which images to generate",
    selectAll: "Select all",
    androidVariants: "Android variants",
    preview: "Preview",
    processing: "Processing image...",
    generate: "Generate icons",
    clear: "Clear",
    ios: "iOS",
    android: "Android",
    windows: "Windows",
    api26: "API 26",
    api25: "API 25 & Legacy",
    invalidFormat: "Invalid format. Use PNG, JPG or WEBP.",
    selectImage: "Select an image before continuing.",
    selectPlatform: "Select at least one platform.",
    selectVariant: "Select at least one Android variant.",
    uploading: "Uploading image...",
    success: "Icons generated successfully. Download started.",
    connectionError: "Connection error with server.",
    previewAlt: "Preview of selected image",
    processingError: "Error processing image."
  },
  es: {
    title: "Unity Icon Generator",
    subtitle: "Sube una imagen cuadrada de al menos 1024x1024 para generar solo los íconos que necesitas.",
    dropTitle: "Arrastra tu imagen aquí",
    dropText: "o haz clic para seleccionar",
    fileHint: "PNG, JPG o WEBP • mínimo 1024x1024",
    selectImages: "Selecciona qué imágenes generar",
    selectAll: "Seleccionar todo",
    androidVariants: "Variantes de Android",
    preview: "Vista previa",
    processing: "Procesando imagen...",
    generate: "Generar íconos",
    clear: "Limpiar",
    ios: "iOS",
    android: "Android",
    windows: "Windows",
    api26: "API 26",
    api25: "API 25 & Legacy",
    invalidFormat: "Formato inválido. Usa PNG, JPG o WEBP.",
    selectImage: "Selecciona una imagen antes de continuar.",
    selectPlatform: "Selecciona al menos una plataforma.",
    selectVariant: "Selecciona al menos una variante de Android.",
    uploading: "Subiendo imagen...",
    success: "Íconos generados correctamente. La descarga ha comenzado.",
    connectionError: "Error de conexión.",
    previewAlt: "Vista previa de la imagen seleccionada",
    processingError: "Error al procesar la imagen."
  }
};

let currentLang = "pt-BR";
let fakeProgressInterval = null;

const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");
const fileMeta = document.getElementById("fileMeta");
const resetButton = document.getElementById("resetButton");
const statusMessage = document.getElementById("statusMessage");
const progressSection = document.getElementById("progressSection");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const processingText = document.getElementById("processingText");
const selectAllTargets = document.getElementById("selectAllTargets");
const androidOptions = document.getElementById("androidOptions");
const languageSelect = document.getElementById("languageSelect");

function t(key) {
  return translations[currentLang][key] || key;
}

function applyTranslations(lang) {
  const selectedLang = translations[lang] ? lang : "en";
  const texts = translations[selectedLang];

  document.documentElement.lang = selectedLang;

  document.getElementById("title").textContent = texts.title;
  document.getElementById("subtitle").textContent = texts.subtitle;
  document.getElementById("dropTitle").textContent = texts.dropTitle;
  document.getElementById("dropText").textContent = texts.dropText;
  document.getElementById("fileHint").textContent = texts.fileHint;
  document.getElementById("selectImagesTitle").textContent = texts.selectImages;
  document.getElementById("selectAllLabel").textContent = texts.selectAll;
  document.getElementById("androidVariantsTitle").textContent = texts.androidVariants;
  document.getElementById("previewTitle").textContent = texts.preview;
  document.getElementById("generateButton").textContent = texts.generate;
  document.getElementById("resetButton").textContent = texts.clear;
  document.getElementById("iosLabel").textContent = texts.ios;
  document.getElementById("androidLabel").textContent = texts.android;
  document.getElementById("windowsLabel").textContent = texts.windows;
  document.getElementById("api26Label").textContent = texts.api26;
  document.getElementById("api25Label").textContent = texts.api25;
  processingText.textContent = texts.processing;
  previewImage.alt = texts.previewAlt;

  currentLang = selectedLang;
  localStorage.setItem("siteLang", selectedLang);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function setStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`.trim();
}

function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((el) => el.value);
}

function syncAndroidOptions() {
  const androidCheckbox = document.querySelector('input[name="targets"][value="android"]');
  const androidChecked = androidCheckbox ? androidCheckbox.checked : false;
  androidOptions.style.display = androidChecked ? "block" : "none";
}

function syncSelectAll() {
  const targetChecks = [...document.querySelectorAll('input[name="targets"]')];
  selectAllTargets.checked = targetChecks.length > 0 && targetChecks.every((input) => input.checked);
}

function showPreview(file) {
  const imageUrl = URL.createObjectURL(file);
  previewImage.src = imageUrl;
  fileMeta.textContent = `${file.name} • ${formatFileSize(file.size)}`;
  previewContainer.classList.remove("hidden");
  setStatus("");
}

function resetUI() {
  fileInput.value = "";
  previewImage.src = "";
  previewContainer.classList.add("hidden");
  progressSection.classList.add("hidden");
  progressFill.style.width = "0%";
  progressText.textContent = "0%";
  processingText.textContent = t("processing");
  setStatus("");
  dropZone.classList.remove("dragover");
  stopFakeProgress();

  document.querySelectorAll('input[name="targets"]').forEach((input) => {
    input.checked = true;
  });

  document.querySelectorAll('input[name="androidVariants"]').forEach((input) => {
    input.checked = true;
  });

  syncAndroidOptions();
  syncSelectAll();
}

function startFakeProgress() {
  let progress = 0;
  progressSection.classList.remove("hidden");
  progressFill.style.width = "0%";
  progressText.textContent = "0%";
  processingText.textContent = t("processing");

  stopFakeProgress();

  fakeProgressInterval = setInterval(() => {
    if (progress < 90) {
      progress += Math.floor(Math.random() * 8) + 3;
      if (progress > 90) progress = 90;
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `${progress}%`;
    }
  }, 250);
}

function completeProgress() {
  progressFill.style.width = "100%";
  progressText.textContent = "100%";
}

function stopFakeProgress() {
  if (fakeProgressInterval) {
    clearInterval(fakeProgressInterval);
    fakeProgressInterval = null;
  }
}

function handleFile(file) {
  if (!file) return;

  const validTypes = ["image/png", "image/jpeg", "image/webp"];
  if (!validTypes.includes(file.type)) {
    setStatus(t("invalidFormat"), "error");
    return;
  }

  showPreview(file);
}

const savedLang = localStorage.getItem("siteLang");
const browserLang = navigator.language.startsWith("pt")
  ? "pt-BR"
  : navigator.language.startsWith("es")
    ? "es"
    : "en";

const initialLang = savedLang || browserLang;

languageSelect.value = initialLang;
applyTranslations(initialLang);

languageSelect.addEventListener("change", (e) => {
  applyTranslations(e.target.value);
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  handleFile(file);
});

dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragenter", (event) => {
  event.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", (event) => {
  if (!dropZone.contains(event.relatedTarget)) {
    dropZone.classList.remove("dragover");
  }
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragover");

  const file = event.dataTransfer.files[0];
  if (!file) return;

  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;

  handleFile(file);
});

document.querySelectorAll('input[name="targets"]').forEach((input) => {
  input.addEventListener("change", () => {
    syncAndroidOptions();
    syncSelectAll();
  });
});

selectAllTargets.addEventListener("change", () => {
  const checked = selectAllTargets.checked;
  document.querySelectorAll('input[name="targets"]').forEach((input) => {
    input.checked = checked;
  });
  syncAndroidOptions();
});

resetButton.addEventListener("click", resetUI);

syncAndroidOptions();
syncSelectAll();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    setStatus(t("selectImage"), "error");
    return;
  }

  const targets = getCheckedValues("targets");
  const androidVariants = getCheckedValues("androidVariants");

  if (targets.length === 0) {
    setStatus(t("selectPlatform"), "error");
    return;
  }

  if (targets.includes("android") && androidVariants.length === 0) {
    setStatus(t("selectVariant"), "error");
    return;
  }

  const formData = new FormData();
  formData.append("icon", file);

  targets.forEach((target) => formData.append("targets", target));
  androidVariants.forEach((variant) => formData.append("androidVariants", variant));

  try {
    setStatus(t("uploading"), "info");
    startFakeProgress();

    const response = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      stopFakeProgress();
      progressSection.classList.add("hidden");
      setStatus(errorText || t("processingError"), "error");
      return;
    }

    const blob = await response.blob();
    stopFakeProgress();
    completeProgress();

    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "icons.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);

    setStatus(t("success"), "success");
  } catch (error) {
    stopFakeProgress();
    progressSection.classList.add("hidden");
    setStatus(t("connectionError"), "error");
    console.error(error);
  }
});