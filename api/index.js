const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const os = require("os");

const app = express();

const UPLOAD_DIR = path.join(os.tmpdir(), "uploads");
const OUTPUT_DIR = path.join(os.tmpdir(), "generated");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

const upload = multer({ dest: UPLOAD_DIR });

/*
ICON SIZES
*/

// iOS

const appIconsIphone = [
  { name: "Iphone App iOS 7-11 60pt@3x.png", size: 180},
  { name: "iPhone App iOS 7-11 60pt@2x.png", size: 120 },
]

const appIconsIpad = [
  { name: "iPad Pro App iOS 7-11 83.5pt@2x.png", size: 167 },
  { name: "iPad App iOS 7-11 76pt@2x.png", size: 152 },
  { name: "iPad App iOS 7-11 76pt@1x.png", size: 76 },
]

const SpotlightIconsIphone = [
  {name: "Iphone Spotlight iOS 7-11 60pt@3x.png", size: 120},
  {name: "Iphone Spotlight iOS 7-11 60pt@2x.png", size: 80}
]

const SpotlightIconsIpad = [
  {name: "iPad Spotlight iOS 7-11 83.5pt@2x.png", size: 80},
  {name: "iPad Spotlight iOS 7-11 83.5pt@1x.png", size: 40}
]
const SettingsIconsIphone = [
  {name: "Iphone Settings iOS 5-11 29pt@3x.png", size: 87 },
  {name: "Iphone Settings iOS 5-11 29pt@2x.png", size: 58 },
  {name: "Iphone Settings iOS 5-11 29pt@1x.png", size: 29 },
]

const SettingsIconsIpad = [
  {name: "iPad Settings iOS 5-11 29pt@2x.png", size: 58 },
  {name: "iPad Settings iOS 5-11 29pt@1x.png", size: 29 },
]

const NotificationsIconsIphone = [
  {name: "Iphone Notification iOS 7-11 20pt@3x.png", size: 60},
  {name: "Iphone Notification iOS 7-11 20pt@2x.png", size: 40}
]
const NotificationsIconsIpad = [
  {name: "Iphone Notification iOS 7-11 20pt@2x.png", size: 40},
  {name: "Iphone Notification iOS 7-11 20pt@1x.png", size: 20}
]

const MarketingIcons = [
  {name: "1x App Store iOS 1024pt.png", size: 1024}
]

// Android


const androidIconsApi26 = [
  { name: "xxxhdpi.png", size: 432 },
  { name: "xxhdpi.png", size: 324 },
  { name: "xhdpi.png", size: 216 },
  { name: "hdpi.png", size: 162 },
  { name: "mdpi.png", size: 108 },
  { name: "ldpi.png", size: 81 },
]

const androidIcons = [
  { name: "xxxhdpi.png", size: 192 },
  { name: "xxhdpi.png", size: 144 },
  { name: "xhdpi.png", size: 96 },
  { name: "hdpi.png", size: 72 },
  { name: "mdpi.png", size: 48 },
  { name: "ldpi.png", size: 36 },
  { name: "playstore-512.png", size: 512 }
];

// Windows

const windowsIcons = [
  { name: "Square44x44Logo.png", size: 44 },
  { name: "Square71x71Logo.png", size: 71 },
  { name: "Square150x150Logo.png", size: 150 },
  { name: "Square310x310Logo.png", size: 310 },
  { name: "Wide310x150Logo.png", size: [310,150] },
  { name: "StoreLogo.png", size: 50 }
];

app.post("/upload", upload.single("icon"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image uploaded");
    }

    const input = req.file.path;
    const id = Date.now().toString();

    const toArray = (value) => {
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    };

    const selectedTargets = toArray(req.body.targets);
    const selectedAndroidVariants = toArray(req.body.androidVariants);

    if (selectedTargets.length === 0) {
      return res.status(400).send("Select at least one platform");
    }

    if (
      selectedTargets.includes("android") &&
      selectedAndroidVariants.length === 0
    ) {
      return res.status(400).send("Select at least one Android variant");
    }

    const metadata = await sharp(input).metadata();

    if (metadata.width !== metadata.height) {
      return res.status(400).send("Image must be square");
    }

    if (metadata.width < 1024) {
      return res.status(400).send("Minimum size is 1024x1024");
    }

    const baseDir = path.join(OUTPUT_DIR, id);
    fs.mkdirSync(baseDir, { recursive: true });

    /*
      iOS
    */
    if (selectedTargets.includes("ios")) {
      const iosDir = path.join(baseDir, "iOS");
      fs.mkdirSync(iosDir, { recursive: true });

      const AppIconsDir = path.join(iosDir, "Application Icons");
      const IphoneAppIconsDir = path.join(AppIconsDir, "Iphone Icons");
      const IpadAppIconsDir = path.join(AppIconsDir, "Ipad Icons");

      fs.mkdirSync(AppIconsDir, { recursive: true });
      fs.mkdirSync(IphoneAppIconsDir, { recursive: true });
      fs.mkdirSync(IpadAppIconsDir, { recursive: true });

      const SpotilightIconsDir = path.join(iosDir, "Spotlight Icons");
      const IphoneSpotilightDir = path.join(SpotilightIconsDir, "Iphone Icons");
      const IpadSpotilightDir = path.join(SpotilightIconsDir, "Ipad Icons");

      fs.mkdirSync(SpotilightIconsDir, { recursive: true });
      fs.mkdirSync(IphoneSpotilightDir, { recursive: true });
      fs.mkdirSync(IpadSpotilightDir, { recursive: true });

      const SettingsIconsDir = path.join(iosDir, "Settings Icons");
      const IphoneSettingsDir = path.join(SettingsIconsDir, "Iphone Icons");
      const IpadSettingsDir = path.join(SettingsIconsDir, "Ipad Icons");

      fs.mkdirSync(SettingsIconsDir, { recursive: true });
      fs.mkdirSync(IphoneSettingsDir, { recursive: true });
      fs.mkdirSync(IpadSettingsDir, { recursive: true });

      const NotificationsIconsDir = path.join(iosDir, "Notifications Icons");
      const IphoneNotificationsDir = path.join(NotificationsIconsDir, "Iphone Icons");
      const IpadNotificationsDir = path.join(NotificationsIconsDir, "Ipad Icons");

      fs.mkdirSync(NotificationsIconsDir, { recursive: true });
      fs.mkdirSync(IphoneNotificationsDir, { recursive: true });
      fs.mkdirSync(IpadNotificationsDir, { recursive: true });

      const MarketingIconsDir = path.join(iosDir, "Marketing Icons");
      const AppStoreDir = path.join(MarketingIconsDir, "App Store iOS");

      fs.mkdirSync(MarketingIconsDir, { recursive: true });
      fs.mkdirSync(AppStoreDir, { recursive: true });

      for (const icon of appIconsIphone) {
        await sharp(input)
          .resize(icon.size, icon.size)
          .png()
          .toFile(path.join(IphoneAppIconsDir, icon.name));
      }

      for (const icon of appIconsIpad) {
        await sharp(input)
          .resize(icon.size, icon.size)
          .png()
          .toFile(path.join(IpadAppIconsDir, icon.name));
      }

      for (const icon of SpotlightIconsIphone) {
        await sharp(input)
          .resize(icon.size, icon.size)
          .png()
          .toFile(path.join(IphoneSpotilightDir, icon.name));
      }

      for (const icon of SpotlightIconsIpad) {
        await sharp(input)
          .resize(icon.size, icon.size)
          .png()
          .toFile(path.join(IpadSpotilightDir, icon.name));
      }

      for (const icon of SettingsIconsIphone) {
        await sharp(input)
          .resize(icon.size, icon.size)
          .png()
          .toFile(path.join(IphoneSettingsDir, icon.name));
      }

      for (const icon of SettingsIconsIpad) {
        await sharp(input)
          .resize(icon.size, icon.size)
          .png()
          .toFile(path.join(IpadSettingsDir, icon.name));
      }

      for (const icon of NotificationsIconsIphone) {
        await sharp(input)
          .resize(icon.size, icon.size)
          .png()
          .toFile(path.join(IphoneNotificationsDir, icon.name));
      }

      for (const icon of NotificationsIconsIpad) {
        await sharp(input)
          .resize(icon.size, icon.size)
          .png()
          .toFile(path.join(IpadNotificationsDir, icon.name));
      }

      for (const icon of MarketingIcons) {
        await sharp(input)
          .resize(icon.size, icon.size)
          .png()
          .toFile(path.join(AppStoreDir, icon.name));
      }
    }

    /*
      Android
    */
    if (selectedTargets.includes("android")) {
      const androidDir = path.join(baseDir, "Android");
      fs.mkdirSync(androidDir, { recursive: true });

      if (selectedAndroidVariants.includes("api26")) {
        const androidDirApi26 = path.join(androidDir, "Api 26");
        fs.mkdirSync(androidDirApi26, { recursive: true });

        for (const icon of androidIconsApi26) {
          await sharp(input)
            .resize(icon.size, icon.size)
            .png()
            .toFile(path.join(androidDirApi26, icon.name));
        }
      }

      if (selectedAndroidVariants.includes("api25")) {
        const androidDirApi25 = path.join(androidDir, "Api 25 & Legacy");
        fs.mkdirSync(androidDirApi25, { recursive: true });

        for (const icon of androidIcons) {
          await sharp(input)
            .resize(icon.size, icon.size)
            .png()
            .toFile(path.join(androidDirApi25, icon.name));
        }
      }
    }

    /*
      Windows
    */
    if (selectedTargets.includes("windows")) {
      const windowsDir = path.join(baseDir, "Windows");
      fs.mkdirSync(windowsDir, { recursive: true });

      for (const icon of windowsIcons) {
        if (Array.isArray(icon.size)) {
          await sharp(input)
            .resize(icon.size[0], icon.size[1])
            .png()
            .toFile(path.join(windowsDir, icon.name));
        } else {
          await sharp(input)
            .resize(icon.size, icon.size)
            .png()
            .toFile(path.join(windowsDir, icon.name));
        }
      }
    }

    /*
      ZIP
    */
    const zipPath = path.join(OUTPUT_DIR, `${id}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip");

    output.on("close", () => {
      res.download(zipPath);
    });

    archive.pipe(output);
    archive.directory(baseDir, false);
    await archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing image");
  }
});

/*
AUTO CLEAN TEMP FILES
*/

setInterval(() => {
  const expiration = 10 * 60 * 1000;
  const now = Date.now();

  fs.readdirSync(UPLOAD_DIR).forEach((file) => {
    const full = path.join(UPLOAD_DIR, file);
    const stat = fs.statSync(full);

    if (now - stat.mtimeMs > expiration) {
      fs.rmSync(full, { recursive: true, force: true });
    }
  });

  fs.readdirSync(OUTPUT_DIR).forEach((item) => {
    const full = path.join(OUTPUT_DIR, item);
    const stat = fs.statSync(full);

    if (now - stat.mtimeMs > expiration) {
      fs.rmSync(full, { recursive: true, force: true });
    }
  });
}, 120000);

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;