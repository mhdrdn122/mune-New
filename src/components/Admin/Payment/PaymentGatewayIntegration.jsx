import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, CircularProgress, Divider, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Alert } from '@mui/material';
import { FaCreditCard, FaPaypal, FaApplePay, FaGooglePay, FaSave, FaKey, FaLock, FaCheckCircle } from 'react-icons/fa';
import notify from '../../../utils/useNotification';
import { ToastContainer } from 'react-toastify';

const PaymentGatewayIntegration = ({ restaurantId }) => {
  // حالات بوابات الدفع
  const [paymentGateways, setPaymentGateways] = useState({
    stripe: {
      enabled: false,
      testMode: true,
      publicKey: '',
      secretKey: '',
    },
    paypal: {
      enabled: false,
      testMode: true,
      clientId: '',
      clientSecret: '',
    },
    applePay: {
      enabled: false,
      testMode: true,
      merchantId: '',
    },
    googlePay: {
      enabled: false,
      testMode: true,
      merchantId: '',
    },
    mada: {
      enabled: false,
      testMode: true,
      merchantId: '',
    }
  });
  
  const [activeTab, setActiveTab] = useState('stripe');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  
  // محاكاة جلب البيانات من API
  useEffect(() => {
    // محاكاة استجابة API
    setTimeout(() => {
      // هذه بيانات افتراضية للعرض فقط
      setPaymentGateways({
        stripe: {
          enabled: true,
          testMode: true,
          publicKey: 'pk_test_sample',
          secretKey: 'sk_test_sample',
        },
        paypal: {
          enabled: false,
          testMode: true,
          clientId: '',
          clientSecret: '',
        },
        applePay: {
          enabled: false,
          testMode: true,
          merchantId: '',
        },
        googlePay: {
          enabled: false,
          testMode: true,
          merchantId: '',
        },
        mada: {
          enabled: false,
          testMode: true,
          merchantId: '',
        }
      });
    }, 500);
  }, [restaurantId]);
  
  // تحديث حالة بوابة الدفع
  const updateGatewayState = (gateway, field, value) => {
    setPaymentGateways(prev => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        [field]: value
      }
    }));
  };
  
  // اختبار اتصال بوابة الدفع
  const testGatewayConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // محاكاة استجابة API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // محاكاة نجاح الاختبار
      setTestResult({
        success: true,
        message: `تم الاتصال ببوابة الدفع ${getGatewayName(activeTab)} بنجاح`
      });
      
      notify(`تم اختبار الاتصال ببوابة الدفع ${getGatewayName(activeTab)} بنجاح`, 'success');
    } catch (error) {
      console.error('خطأ في اختبار الاتصال:', error);
      
      setTestResult({
        success: false,
        message: `فشل الاتصال ببوابة الدفع ${getGatewayName(activeTab)}`
      });
      
      notify(`فشل اختبار الاتصال ببوابة الدفع ${getGatewayName(activeTab)}`, 'error');
    } finally {
      setIsTesting(false);
    }
  };
  
  // حفظ إعدادات بوابات الدفع
  const savePaymentSettings = async () => {
    setIsSaving(true);
    
    try {
      // محاكاة استجابة API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      notify('تم حفظ إعدادات بوابات الدفع بنجاح', 'success');
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      notify('حدث خطأ أثناء حفظ إعدادات بوابات الدفع', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // الحصول على اسم بوابة الدفع بالعربية
  const getGatewayName = (gateway) => {
    switch (gateway) {
      case 'stripe':
        return 'Stripe';
      case 'paypal':
        return 'PayPal';
      case 'applePay':
        return 'آبل باي';
      case 'googlePay':
        return 'جوجل باي';
      case 'mada':
        return 'مدى';
      default:
        return gateway;
    }
  };
  
  // الحصول على أيقونة بوابة الدفع
  const getGatewayIcon = (gateway) => {
    switch (gateway) {
      case 'stripe':
        return <FaCreditCard />;
      case 'paypal':
        return <FaPaypal />;
      case 'applePay':
        return <FaApplePay />;
      case 'googlePay':
        return <FaGooglePay />;
      case 'mada':
        return <FaCreditCard />;
      default:
        return <FaCreditCard />;
    }
  };
  
  // مكون تبويب بوابة الدفع
  const GatewayTab = ({ gateway }) => {
    const gatewayData = paymentGateways[gateway];
    
    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={gatewayData.enabled}
                onChange={(e) => updateGatewayState(gateway, 'enabled', e.target.checked)}
                color="primary"
              />
            }
            label={`تفعيل ${getGatewayName(gateway)}`}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={gatewayData.testMode}
                onChange={(e) => updateGatewayState(gateway, 'testMode', e.target.checked)}
                color="secondary"
                disabled={!gatewayData.enabled}
              />
            }
            label="وضع الاختبار (Sandbox)"
            sx={{ ml: 3 }}
          />
        </Box>
        
        {gateway === 'stripe' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="مفتاح API العام (Public Key)"
                value={gatewayData.publicKey}
                onChange={(e) => updateGatewayState(gateway, 'publicKey', e.target.value)}
                disabled={!gatewayData.enabled}
                InputProps={{
                  startAdornment: <FaKey style={{ marginLeft: '8px' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="مفتاح API السري (Secret Key)"
                value={gatewayData.secretKey}
                onChange={(e) => updateGatewayState(gateway, 'secretKey', e.target.value)}
                disabled={!gatewayData.enabled}
                type="password"
                InputProps={{
                  startAdornment: <FaLock style={{ marginLeft: '8px' }} />,
                }}
              />
            </Grid>
          </Grid>
        )}
        
        {gateway === 'paypal' && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="معرف العميل (Client ID)"
                value={gatewayData.clientId}
                onChange={(e) => updateGatewayState(gateway, 'clientId', e.target.value)}
                disabled={!gatewayData.enabled}
                InputProps={{
                  startAdornment: <FaKey style={{ marginLeft: '8px' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="سر العميل (Client Secret)"
                value={gatewayData.clientSecret}
                onChange={(e) => updateGatewayState(gateway, 'clientSecret', e.target.value)}
                disabled={!gatewayData.enabled}
                type="password"
                InputProps={{
                  startAdornment: <FaLock style={{ marginLeft: '8px' }} />,
                }}
              />
            </Grid>
          </Grid>
        )}
        
        {(gateway === 'applePay' || gateway === 'googlePay' || gateway === 'mada') && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="معرف التاجر (Merchant ID)"
                value={gatewayData.merchantId}
                onChange={(e) => updateGatewayState(gateway, 'merchantId', e.target.value)}
                disabled={!gatewayData.enabled}
                InputProps={{
                  startAdornment: <FaKey style={{ marginLeft: '8px' }} />,
                }}
              />
            </Grid>
          </Grid>
        )}
        
        {gatewayData.enabled && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={testGatewayConnection}
              disabled={isTesting}
              startIcon={isTesting ? <CircularProgress size={20} /> : null}
            >
              {isTesting ? 'جاري الاختبار...' : 'اختبار الاتصال'}
            </Button>
            
            {testResult && testResult.success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FaCheckCircle style={{ marginLeft: '8px' }} />
                  {testResult.message}
                </Box>
              </Alert>
            )}
            
            {testResult && !testResult.success && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {testResult.message}
              </Alert>
            )}
          </Box>
        )}
      </Box>
    );
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: '8px', bgcolor: '#f8f9fa' }}>
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
          <FaCreditCard style={{ marginLeft: '8px' }} />
          إدارة واجهات الدفع الإلكتروني
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
          قم بتكوين وإدارة بوابات الدفع الإلكتروني المختلفة لمطعمك
        </Typography>
      </Paper>
      
      <Grid container spacing={4}>
        {/* القسم الأيسر - التبويبات */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: '8px' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
              بوابات الدفع
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Object.keys(paymentGateways).map(gateway => (
                <Button
                  key={gateway}
                  variant={activeTab === gateway ? 'contained' : 'outlined'}
                  color={activeTab === gateway ? 'primary' : 'inherit'}
                  onClick={() => setActiveTab(gateway)}
                  startIcon={getGatewayIcon(gateway)}
                  sx={{ 
                    justifyContent: 'flex-start',
                    py: 1.5,
                    borderRadius: '8px',
                    backgroundColor: activeTab === gateway ? undefined : paymentGateways[gateway].enabled ? '#e3f2fd' : undefined
                  }}
                >
                  {getGatewayName(gateway)}
                </Button>
              ))}
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={savePaymentSettings}
                disabled={isSaving}
                startIcon={isSaving ? <CircularProgress size={20} /> : <FaSave />}
                sx={{ py: 1.5, borderRadius: '8px' }}
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* القسم الأيمن - محتوى التبويب */}
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {getGatewayIcon(activeTab)}
              <Typography variant="h5" sx={{ ml: 1, fontWeight: 'bold' }}>
                إعدادات {getGatewayName(activeTab)}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <GatewayTab gateway={activeTab} />
          </Paper>
        </Grid>
      </Grid>
      
      <ToastContainer />
    </Box>
  );
};

export default PaymentGatewayIntegration;
