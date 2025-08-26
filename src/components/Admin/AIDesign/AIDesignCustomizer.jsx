import React, { useState } from 'react';
import { Box, Paper, Typography, Slider, TextField, Button, Grid, CircularProgress, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FaPalette, FaFont, FaCreditCard, FaMagic, FaSave } from 'react-icons/fa';
import notify from '../../../utils/useNotification';
import { ToastContainer } from 'react-toastify';
import { generateDesignSuggestions, generateHarmonizedColor } from './OpenSourceDesignGenerator';

// مكون واجهة الدفع الإلكتروني
const PaymentIntegration = ({ paymentMethods, updatePaymentMethod }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: '8px', mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
        <FaCreditCard style={{ marginLeft: '8px' }} />
        واجهات الدفع الإلكتروني
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>بطاقة ائتمان</InputLabel>
            <Select
              value={paymentMethods.creditCard}
              label="بطاقة ائتمان"
              onChange={(e) => updatePaymentMethod('creditCard', e.target.value)}
            >
              <MenuItem value={true}>مفعل</MenuItem>
              <MenuItem value={false}>معطل</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>باي بال</InputLabel>
            <Select
              value={paymentMethods.paypal}
              label="باي بال"
              onChange={(e) => updatePaymentMethod('paypal', e.target.value)}
            >
              <MenuItem value={true}>مفعل</MenuItem>
              <MenuItem value={false}>معطل</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>آبل باي</InputLabel>
            <Select
              value={paymentMethods.applePay}
              label="آبل باي"
              onChange={(e) => updatePaymentMethod('applePay', e.target.value)}
            >
              <MenuItem value={true}>مفعل</MenuItem>
              <MenuItem value={false}>معطل</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>جوجل باي</InputLabel>
            <Select
              value={paymentMethods.googlePay}
              label="جوجل باي"
              onChange={(e) => updatePaymentMethod('googlePay', e.target.value)}
            >
              <MenuItem value={true}>مفعل</MenuItem>
              <MenuItem value={false}>معطل</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

const AIDesignCustomizer = ({ restaurantId }) => {
  // حالات التصميم
  const [primaryColor, setPrimaryColor] = useState('#1976d2');
  const [secondaryColor, setSecondaryColor] = useState('#f44336');
  const [accentColor, setAccentColor] = useState('#4caf50');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#333333');
  
  const [fontFamily, setFontFamily] = useState('ArbFONTS-URW-DIN-Arabic');
  const [fontSize, setFontSize] = useState(16);
  const [borderRadius, setBorderRadius] = useState(8);
  const [buttonStyle, setButtonStyle] = useState('filled');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  
  const [paymentMethods, setPaymentMethods] = useState({
    creditCard: true,
    paypal: false,
    applePay: false,
    googlePay: false
  });
  
  // قائمة الخطوط المتاحة
  const availableFonts = [
    'ArbFONTS-URW-DIN-Arabic',
    'ArbFONTS-URW-DIN-Arabic-Bold',
    'ArbFONTS-URW-DIN-Arabic-Medium',
    'ArbFONTS-URW-DIN-Arabic-Demi',
    'Cairo',
    'Tajawal',
    'Amiri'
  ];
  
  // أنماط الأزرار
  const buttonStyles = [
    { value: 'filled', label: 'معبأ' },
    { value: 'outlined', label: 'محدد' },
    { value: 'rounded', label: 'مستدير' },
    { value: 'text', label: 'نص فقط' }
  ];
  
  // توليد اقتراحات تصميم باستخدام مولد مفتوح المصدر
  const generateAIDesignSuggestions = async () => {
    setIsGenerating(true);
    
    try {
      // محاكاة تأخير الشبكة للتجربة الواقعية
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // استخدام مولد التصميم مفتوح المصدر
      const currentTheme = {
        primaryColor,
        secondaryColor,
        accentColor,
        backgroundColor,
        textColor,
        fontFamily,
        fontSize,
        borderRadius,
        buttonStyle
      };
      
      // توليد 4 اقتراحات تصميم
      const suggestions = generateDesignSuggestions(currentTheme, 4);
      
      setAiSuggestions(suggestions);
      notify('تم توليد اقتراحات التصميم بنجاح باستخدام خوارزميات مفتوحة المصدر', 'success');
    } catch (error) {
      console.error('خطأ في توليد اقتراحات التصميم:', error);
      notify('حدث خطأ أثناء توليد اقتراحات التصميم', 'error');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // توليد لون متناسق عند تغيير اللون الرئيسي
  const generateHarmonizedColors = (newPrimaryColor) => {
    setPrimaryColor(newPrimaryColor);
    
    // توليد لون ثانوي متناسق (متمم)
    const newSecondaryColor = generateHarmonizedColor(newPrimaryColor, 'complementary');
    setSecondaryColor(newSecondaryColor);
    
    // توليد لون تأكيد متناسق (ثلاثي)
    const newAccentColor = generateHarmonizedColor(newPrimaryColor, 'triadic');
    setAccentColor(newAccentColor);
  };
  
  // تطبيق السمة المختارة
  const applyTheme = (theme) => {
    setPrimaryColor(theme.primaryColor);
    setSecondaryColor(theme.secondaryColor);
    setAccentColor(theme.accentColor);
    setBackgroundColor(theme.backgroundColor);
    setTextColor(theme.textColor);
    setFontFamily(theme.fontFamily);
    setFontSize(theme.fontSize);
    setBorderRadius(theme.borderRadius);
    setButtonStyle(theme.buttonStyle);
    setSelectedTheme(theme.id);
    
    notify(`تم تطبيق سمة "${theme.name}" بنجاح`, 'success');
  };
  
  // حفظ التغييرات
  const saveChanges = async () => {
    setIsSaving(true);
    
    try {
      // محاكاة استجابة API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      notify('تم حفظ التغييرات بنجاح', 'success');
    } catch (error) {
      console.error('خطأ في حفظ التغييرات:', error);
      notify('حدث خطأ أثناء حفظ التغييرات', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // تحديث طرق الدفع
  const updatePaymentMethod = (method, value) => {
    setPaymentMethods({
      ...paymentMethods,
      [method]: value
    });
  };
  
  // معاينة التصميم
  const PreviewComponent = () => {
    // تحديد نمط الزر
    const getButtonSx = () => {
      const baseStyle = {
        backgroundColor: buttonStyle === 'outlined' ? 'transparent' : accentColor,
        color: buttonStyle === 'outlined' ? accentColor : '#FFFFFF',
        border: buttonStyle === 'outlined' ? `2px solid ${accentColor}` : 'none',
        borderRadius: buttonStyle === 'rounded' ? '50px' : `${borderRadius}px`,
        padding: '8px 16px',
        '&:hover': { 
          backgroundColor: buttonStyle === 'outlined' ? `${accentColor}22` : `${accentColor}DD`
        }
      };
      
      if (buttonStyle === 'text') {
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          border: 'none',
          color: accentColor,
          '&:hover': { backgroundColor: `${accentColor}22` }
        };
      }
      
      return baseStyle;
    };
    
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: `${borderRadius}px`, 
          backgroundColor: backgroundColor,
          fontFamily: fontFamily,
          fontSize: `${fontSize}px`,
          color: textColor,
          mb: 3
        }}
      >
        <Typography variant="h5" sx={{ color: primaryColor, fontFamily: 'inherit', mb: 2, fontWeight: 'bold' }}>
          معاينة التصميم
        </Typography>
        
        <Box sx={{ 
          p: 2, 
          backgroundColor: secondaryColor, 
          color: '#FFFFFF', 
          borderRadius: `${borderRadius}px`,
          mb: 2
        }}>
          هذا مثال على عنصر بلون ثانوي
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button 
            variant={buttonStyle === 'outlined' ? 'outlined' : 'contained'} 
            sx={getButtonSx()}
          >
            زر رئيسي
          </Button>
          
          <Button 
            variant="text" 
            sx={{ 
              color: primaryColor,
              '&:hover': { backgroundColor: `${primaryColor}22` }
            }}
          >
            زر نصي
          </Button>
        </Box>
        
        <Box sx={{ 
          p: 2, 
          backgroundColor: `${primaryColor}22`, 
          borderRadius: `${borderRadius}px`,
          borderLeft: `4px solid ${primaryColor}`,
          mb: 2
        }}>
          <Typography sx={{ fontFamily: 'inherit' }}>
            هذا مثال على نص في إطار مميز
          </Typography>
        </Box>
      </Paper>
    );
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: '8px', bgcolor: '#f8f9fa' }}>
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
          <FaMagic style={{ marginLeft: '8px' }} />
          مولد التصميم الذكي (مفتوح المصدر)
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
          قم بتخصيص ألوان وخطوط وأشكال واجهة المستخدم بسهولة، أو استخدم مولد التصميم الذكي مفتوح المصدر لتوليد تصاميم احترافية
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#4caf50' }}>
          جميع الخوارزميات تعمل محلياً بدون أي تكاليف أو اشتراكات
        </Typography>
      </Paper>
      
      <Grid container spacing={4}>
        {/* القسم الأيسر - المعاينة */}
        <Grid item xs={12} md={5}>
          <PreviewComponent />
          
          <PaymentIntegration 
            paymentMethods={paymentMethods} 
            updatePaymentMethod={updatePaymentMethod} 
          />
        </Grid>
        
        {/* القسم الأيمن - الإعدادات */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '8px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <FaPalette style={{ marginLeft: '8px' }} />
                الألوان
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={generateAIDesignSuggestions}
                disabled={isGenerating}
                startIcon={isGenerating ? <CircularProgress size={20} /> : <FaMagic />}
                sx={{ borderRadius: '20px' }}
              >
                {isGenerating ? 'جاري التوليد...' : 'توليد اقتراحات تصميم ذكية'}
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>اللون الرئيسي</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: primaryColor, 
                      mr: 1, 
                      borderRadius: 1,
                      border: '1px solid #ddd'
                    }} 
                  />
                  <TextField 
                    fullWidth 
                    value={primaryColor} 
                    onChange={(e) => generateHarmonizedColors(e.target.value)}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography>اللون الثانوي</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: secondaryColor, 
                      mr: 1, 
                      borderRadius: 1,
                      border: '1px solid #ddd'
                    }} 
                  />
                  <TextField 
                    fullWidth 
                    value={secondaryColor} 
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography>لون التأكيد</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: accentColor, 
                      mr: 1, 
                      borderRadius: 1,
                      border: '1px solid #ddd'
                    }} 
                  />
                  <TextField 
                    fullWidth 
                    value={accentColor} 
                    onChange={(e) => setAccentColor(e.target.value)}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography>لون الخلفية</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: backgroundColor, 
                      mr: 1, 
                      borderRadius: 1,
                      border: '1px solid #ddd'
                    }} 
                  />
                  <TextField 
                    fullWidth 
                    value={backgroundColor} 
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography>لون النص</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: textColor, 
                      mr: 1, 
                      borderRadius: 1,
                      border: '1px solid #ddd'
                    }} 
                  />
                  <TextField 
                    fullWidth 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <FaFont style={{ marginLeft: '8px' }} />
              الخطوط والأشكال
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>نوع الخط</InputLabel>
                  <Select
                    value={fontFamily}
                    label="نوع الخط"
                    onChange={(e) => setFontFamily(e.target.value)}
                  >
                    {availableFonts.map(font => (
                      <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>نمط الأزرار</InputLabel>
                  <Select
                    value={buttonStyle}
                    label="نمط الأزرار"
                    onChange={(e) => setButtonStyle(e.target.value)}
                  >
                    {buttonStyles.map(style => (
                      <MenuItem key={style.value} value={style.value}>
                        {style.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Typography>حجم الخط: {fontSize}px</Typography>
                <Slider
                  value={fontSize}
                  onChange={(e, newValue) => setFontSize(newValue)}
                  min={12}
                  max={24}
                  step={1}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>استدارة الحواف: {borderRadius}px</Typography>
                <Slider
                  value={borderRadius}
                  onChange={(e, newValue) => setBorderRadius(newValue)}
                  min={0}
                  max={24}
                  step={1}
                />
              </Grid>
            </Grid>
            
            {aiSuggestions.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  اقتراحات التصميم الذكية
                </Typography>
                <Grid container spacing={2}>
                  {aiSuggestions.map(theme => (
                    <Grid item xs={12} sm={6} key={theme.id}>
                      <Paper 
                        elevation={selectedTheme === theme.id ? 8 : 2} 
                        sx={{ 
                          p: 2,
                          cursor: 'pointer',
                          borderRadius: `${theme.borderRadius}px`,
                          backgroundColor: theme.backgroundColor,
                          border: selectedTheme === theme.id ? `2px solid ${theme.primaryColor}` : 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                          }
                        }}
                        onClick={() => applyTheme(theme)}
                      >
                        <Typography sx={{ 
                          color: theme.primaryColor, 
                          fontFamily: theme.fontFamily,
                          fontSize: `${theme.fontSize + 2}px`,
                          mb: 1,
                          fontWeight: 'bold'
                        }}>
                          {theme.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Box sx={{ width: 24, height: 24, backgroundColor: theme.primaryColor, borderRadius: 1 }} />
                          <Box sx={{ width: 24, height: 24, backgroundColor: theme.secondaryColor, borderRadius: 1 }} />
                          <Box sx={{ width: 24, height: 24, backgroundColor: theme.accentColor, borderRadius: 1 }} />
                          <Box sx={{ width: 24, height: 24, backgroundColor: theme.textColor, borderRadius: 1 }} />
                        </Box>
                        <Box 
                          sx={{ 
                            p: 1, 
                            backgroundColor: theme.secondaryColor, 
                            color: '#fff', 
                            borderRadius: `${theme.borderRadius/2}px`,
                            fontSize: `${theme.fontSize-2}px`,
                            fontFamily: theme.fontFamily,
                            textAlign: 'center',
                            mb: 2
                          }}
                        >
                          نموذج عنوان
                        </Box>
                        <Button 
                          variant={theme.buttonStyle === 'outlined' ? 'outlined' : 'contained'}
                          size="small"
                          sx={{ 
                            backgroundColor: theme.buttonStyle === 'outlined' ? 'transparent' : theme.accentColor,
                            color: theme.buttonStyle === 'outlined' ? theme.accentColor : '#fff',
                            border: theme.buttonStyle === 'outlined' ? `1px solid ${theme.accentColor}` : 'none',
                            borderRadius: theme.buttonStyle === 'rounded' ? '50px' : `${theme.borderRadius}px`,
                            fontFamily: theme.fontFamily,
                            fontSize: `${theme.fontSize-4}px`,
                            mt: 1
                          }}
                        >
                          زر
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={saveChanges}
                disabled={isSaving}
                startIcon={isSaving ? <CircularProgress size={20} /> : <FaSave />}
                sx={{ borderRadius: '8px', py: 1, px: 4 }}
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <ToastContainer />
    </Box>
  );
};

export default AIDesignCustomizer;
