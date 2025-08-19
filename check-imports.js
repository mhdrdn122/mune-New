import fs from "fs";
import path from "path";

const projectRoot = path.resolve("./src"); // مسار الكود الأساسي عندك

// دالة تمشي على كل الملفات داخل المشروع
function getAllFiles(dir, files = []) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (/\.(jsx?|tsx?)$/.test(file)) {
      files.push(fullPath);
    }
  }
  return files;
}

// دالة تتحقق من الاستيرادات داخل ملف
function checkFileImports(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const importRegex =
    /(?:import\s+.*?\s+from\s+['"](.+?)['"]|require\(['"](.+?)['"]\))/g;

  let match;
  while ((match = importRegex.exec(content))) {
    const importPath = match[1] || match[2];
    if (
      importPath.startsWith(".") // فقط الاستيرادات المحلية
    ) {
      const resolvedPath = path.resolve(path.dirname(filePath), importPath);

      const withExts = [resolvedPath, resolvedPath + ".js", resolvedPath + ".jsx", resolvedPath + ".ts", resolvedPath + ".tsx"];

      // لو كان مجلد فيه index.js
      withExts.push(path.join(resolvedPath, "index.js"));
      withExts.push(path.join(resolvedPath, "index.jsx"));

      // لو الملف صورة أو خط
      const assetExts = [".png", ".jpg", ".jpeg", ".svg", ".gif", ".ttf", ".woff", ".woff2"];
      for (const ext of assetExts) {
        withExts.push(resolvedPath + ext);
      }

      // شيك إذا الملف موجود
      if (!withExts.some(fs.existsSync)) {
        console.log(
          `❌ مشكلة استيراد في: ${filePath}\n   → ${importPath} (لم يتم العثور عليه)`
        );
      }
    }
  }
}

// نفّذ الفحص
const files = getAllFiles(projectRoot);
files.forEach(checkFileImports);

console.log("✅ تم الفحص. لو ما ظهر أي خطأ، كل الاستيرادات صحيحة.");
