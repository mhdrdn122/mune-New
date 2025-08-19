/**
 * مولد تصاميم مفتوح المصدر
 * 
 * هذا الملف يحتوي على خوارزميات مفتوحة المصدر لتوليد اقتراحات تصميم
 * جميع الخوارزميات تعمل محلياً دون الحاجة لأي خدمات سحابية أو API مدفوعة
 */

// مجموعات ألوان متناسقة مفتوحة المصدر
const colorPalettes = [
  // كلاسيكي فاخر
  {
    name: 'كلاسيكي فاخر',
    primaryColor: '#8B4513',
    secondaryColor: '#DAA520',
    accentColor: '#006400',
    backgroundColor: '#FFF8E1',
    textColor: '#3E2723'
  },
  // عصري مبسط
  {
    name: 'عصري مبسط',
    primaryColor: '#3F51B5',
    secondaryColor: '#FF4081',
    accentColor: '#00BCD4',
    backgroundColor: '#FFFFFF',
    textColor: '#212121'
  },
  // دافئ وترحيبي
  {
    name: 'دافئ وترحيبي',
    primaryColor: '#E65100',
    secondaryColor: '#FFA000',
    accentColor: '#689F38',
    backgroundColor: '#FFF3E0',
    textColor: '#3E2723'
  },
  // مودرن داكن
  {
    name: 'مودرن داكن',
    primaryColor: '#303F9F',
    secondaryColor: '#D32F2F',
    accentColor: '#00796B',
    backgroundColor: '#212121',
    textColor: '#FFFFFF'
  },
  // أزرق هادئ
  {
    name: 'أزرق هادئ',
    primaryColor: '#1565C0',
    secondaryColor: '#26A69A',
    accentColor: '#FFC107',
    backgroundColor: '#E3F2FD',
    textColor: '#263238'
  },
  // وردي عصري
  {
    name: 'وردي عصري',
    primaryColor: '#AD1457',
    secondaryColor: '#6A1B9A',
    accentColor: '#00BCD4',
    backgroundColor: '#FCE4EC',
    textColor: '#4A148C'
  },
  // أخضر طبيعي
  {
    name: 'أخضر طبيعي',
    primaryColor: '#2E7D32',
    secondaryColor: '#F9A825',
    accentColor: '#5D4037',
    backgroundColor: '#E8F5E9',
    textColor: '#1B5E20'
  }
];

// خيارات الخطوط المفتوحة المصدر
const fontOptions = [
  'ArbFONTS-URW-DIN-Arabic',
  'ArbFONTS-URW-DIN-Arabic-Bold',
  'ArbFONTS-URW-DIN-Arabic-Medium',
  'ArbFONTS-URW-DIN-Arabic-Demi',
  'Cairo',
  'Tajawal',
  'Amiri'
];

// أنماط الأزرار
const buttonStyleOptions = [
  'filled',
  'outlined',
  'rounded',
  'text'
];

/**
 * توليد اقتراحات تصميم باستخدام خوارزمية مفتوحة المصدر
 * @param {Object} currentTheme - التصميم الحالي (اختياري)
 * @param {number} count - عدد الاقتراحات المطلوبة
 * @returns {Array} مصفوفة من اقتراحات التصميم
 */
export const generateDesignSuggestions = (currentTheme = null, count = 3) => {
  const suggestions = [];
  
  // اختيار مجموعات ألوان عشوائية مختلفة
  const selectedPalettes = selectRandomPalettes(count);
  
  // إنشاء اقتراحات التصميم
  for (let i = 0; i < count; i++) {
    const palette = selectedPalettes[i];
    const fontFamily = selectRandomFont();
    const fontSize = getRandomNumber(14, 20);
    const borderRadius = getRandomNumber(0, 16);
    const buttonStyle = selectRandomButtonStyle();
    
    suggestions.push({
      id: i + 1,
      name: palette.name,
      primaryColor: palette.primaryColor,
      secondaryColor: palette.secondaryColor,
      accentColor: palette.accentColor,
      backgroundColor: palette.backgroundColor,
      textColor: palette.textColor,
      fontFamily,
      fontSize,
      borderRadius,
      buttonStyle
    });
  }
  
  return suggestions;
};

/**
 * اختيار مجموعات ألوان عشوائية
 * @param {number} count - عدد المجموعات المطلوبة
 * @returns {Array} مصفوفة من مجموعات الألوان
 */
const selectRandomPalettes = (count) => {
  // نسخ مصفوفة مجموعات الألوان
  const palettes = [...colorPalettes];
  
  // خلط المصفوفة بشكل عشوائي
  shuffleArray(palettes);
  
  // إرجاع العدد المطلوب من المجموعات
  return palettes.slice(0, count);
};

/**
 * اختيار خط عشوائي
 * @returns {string} اسم الخط
 */
const selectRandomFont = () => {
  const randomIndex = Math.floor(Math.random() * fontOptions.length);
  return fontOptions[randomIndex];
};

/**
 * اختيار نمط زر عشوائي
 * @returns {string} نمط الزر
 */
const selectRandomButtonStyle = () => {
  const randomIndex = Math.floor(Math.random() * buttonStyleOptions.length);
  return buttonStyleOptions[randomIndex];
};

/**
 * الحصول على رقم عشوائي ضمن نطاق محدد
 * @param {number} min - الحد الأدنى
 * @param {number} max - الحد الأقصى
 * @returns {number} رقم عشوائي
 */
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * خلط مصفوفة بشكل عشوائي
 * @param {Array} array - المصفوفة المراد خلطها
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/**
 * توليد لون متناسق مع لون معين
 * @param {string} baseColor - اللون الأساسي بصيغة HEX
 * @param {string} type - نوع اللون المتناسق (complementary, analogous, triadic)
 * @returns {string} لون متناسق بصيغة HEX
 */
export const generateHarmonizedColor = (baseColor, type = 'complementary') => {
  // تحويل اللون من HEX إلى HSL
  const hsl = hexToHSL(baseColor);
  
  let newHue = hsl.h;
  
  // تحديد اللون المتناسق حسب النوع
  switch (type) {
    case 'complementary': // لون متمم (مقابل في عجلة الألوان)
      newHue = (hsl.h + 180) % 360;
      break;
    case 'analogous': // لون متجانس (قريب في عجلة الألوان)
      newHue = (hsl.h + 30) % 360;
      break;
    case 'triadic': // لون ثلاثي (على بعد 120 درجة في عجلة الألوان)
      newHue = (hsl.h + 120) % 360;
      break;
    default:
      newHue = (hsl.h + 180) % 360;
  }
  
  // إرجاع اللون الجديد بصيغة HEX
  return hslToHex(newHue, hsl.s, hsl.l);
};

/**
 * تحويل لون من صيغة HEX إلى HSL
 * @param {string} hex - لون بصيغة HEX
 * @returns {Object} كائن يحتوي على قيم HSL
 */
const hexToHSL = (hex) => {
  // إزالة الرمز # إذا كان موجوداً
  hex = hex.replace(/^#/, '');
  
  // تحويل HEX إلى RGB
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // حساب القيم الدنيا والقصوى
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // حساب الإضاءة
  let l = (max + min) / 2;
  
  let h, s;
  
  if (max === min) {
    // اللون رمادي
    h = s = 0;
  } else {
    // حساب التشبع
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    
    // حساب الصبغة
    switch (max) {
      case r:
        h = (g - b) / (max - min) + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / (max - min) + 2;
        break;
      case b:
        h = (r - g) / (max - min) + 4;
        break;
    }
    
    h = h * 60;
  }
  
  // تقريب القيم
  h = Math.round(h);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  return { h, s, l };
};

/**
 * تحويل لون من صيغة HSL إلى HEX
 * @param {number} h - الصبغة (0-360)
 * @param {number} s - التشبع (0-100)
 * @param {number} l - الإضاءة (0-100)
 * @returns {string} لون بصيغة HEX
 */
const hslToHex = (h, s, l) => {
  // تحويل القيم إلى نطاق 0-1
  h = h / 360;
  s = s / 100;
  l = l / 100;
  
  let r, g, b;
  
  if (s === 0) {
    // اللون رمادي
    r = g = b = l;
  } else {
    // حساب قيم RGB
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  // تحويل إلى قيم HEX
  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * تحليل مطعم وتوليد اقتراحات تصميم مناسبة
 * @param {Object} restaurantInfo - معلومات المطعم
 * @returns {Array} مصفوفة من اقتراحات التصميم
 */
export const analyzeRestaurantAndGenerateThemes = (restaurantInfo) => {
  // هذه الدالة تحلل معلومات المطعم وتقترح تصاميم مناسبة
  // يمكن تطويرها لتأخذ بعين الاعتبار نوع المطعم، والمأكولات، والجو العام
  
  const suggestions = [];
  
  // اختيار مجموعات ألوان مناسبة حسب نوع المطعم
  let suitablePalettes = [];
  
  if (restaurantInfo && restaurantInfo.type) {
    switch (restaurantInfo.type.toLowerCase()) {
      case 'italian':
      case 'إيطالي':
        suitablePalettes = [
          {
            name: 'إيطالي تقليدي',
            primaryColor: '#8B0000',
            secondaryColor: '#FFA500',
            accentColor: '#006400',
            backgroundColor: '#FFF8E1',
            textColor: '#3E2723'
          },
          {
            name: 'بيتزا وباستا',
            primaryColor: '#D32F2F',
            secondaryColor: '#FBC02D',
            accentColor: '#388E3C',
            backgroundColor: '#FFFDE7',
            textColor: '#212121'
          }
        ];
        break;
        
      case 'asian':
      case 'آسيوي':
        suitablePalettes = [
          {
            name: 'آسيوي تقليدي',
            primaryColor: '#B71C1C',
            secondaryColor: '#FFD600',
            accentColor: '#004D40',
            backgroundColor: '#FFF8E1',
            textColor: '#212121'
          },
          {
            name: 'سوشي وساكي',
            primaryColor: '#263238',
            secondaryColor: '#D50000',
            accentColor: '#00BFA5',
            backgroundColor: '#ECEFF1',
            textColor: '#263238'
          }
        ];
        break;
        
      case 'fast food':
      case 'وجبات سريعة':
        suitablePalettes = [
          {
            name: 'برجر وبطاطا',
            primaryColor: '#F44336',
            secondaryColor: '#FFC107',
            accentColor: '#4CAF50',
            backgroundColor: '#FFFFFF',
            textColor: '#212121'
          },
          {
            name: 'وجبات سريعة عصرية',
            primaryColor: '#FF5722',
            secondaryColor: '#FFEB3B',
            accentColor: '#2196F3',
            backgroundColor: '#FAFAFA',
            textColor: '#212121'
          }
        ];
        break;
        
      default:
        // استخدام مجموعات الألوان العامة
        suitablePalettes = colorPalettes.slice(0, 3);
    }
  } else {
    // استخدام مجموعات الألوان العامة
    suitablePalettes = colorPalettes.slice(0, 3);
  }
  
  // إنشاء اقتراحات التصميم
  for (let i = 0; i < suitablePalettes.length; i++) {
    const palette = suitablePalettes[i];
    const fontFamily = selectRandomFont();
    const fontSize = getRandomNumber(14, 20);
    const borderRadius = getRandomNumber(0, 16);
    const buttonStyle = selectRandomButtonStyle();
    
    suggestions.push({
      id: i + 1,
      name: palette.name,
      primaryColor: palette.primaryColor,
      secondaryColor: palette.secondaryColor,
      accentColor: palette.accentColor,
      backgroundColor: palette.backgroundColor,
      textColor: palette.textColor,
      fontFamily,
      fontSize,
      borderRadius,
      buttonStyle
    });
  }
  
  return suggestions;
};

export default {
  generateDesignSuggestions,
  generateHarmonizedColor,
  analyzeRestaurantAndGenerateThemes
};
