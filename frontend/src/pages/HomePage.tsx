import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Accessible as AccessibleIcon,
  Favorite as FavoriteIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { setUserLocation, setLocationLoading, setLocationError } from '../store/slices/searchSlice';
import { announceToScreenReader } from '../store/slices/accessibilitySlice';
import MapComponent from '../components/Map/MapComponent';
import SearchBar from '../components/Search/SearchBar';
import QuickStats from '../components/Stats/QuickStats';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const { userLocation, locationLoading, locationError } = useSelector((state: RootState) => state.search);
  const { settings } = useSelector((state: RootState) => state.accessibility);

  // 取得使用者位置
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      dispatch(setLocationError('此瀏覽器不支援地理位置功能'));
      return;
    }

    setIsLoadingLocation(true);
    dispatch(setLocationLoading(true));
    dispatch(setLocationError(null));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        dispatch(setUserLocation(location));
        setIsLoadingLocation(false);
        dispatch(setLocationLoading(false));
        dispatch(announceToScreenReader('位置已取得，開始搜尋附近的廁所'));
      },
      (error) => {
        let errorMessage = '無法取得位置資訊';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '位置存取權限被拒絕';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置資訊不可用';
            break;
          case error.TIMEOUT:
            errorMessage = '位置請求超時';
            break;
        }
        dispatch(setLocationError(errorMessage));
        setIsLoadingLocation(false);
        dispatch(setLocationLoading(false));
        dispatch(announceToScreenReader(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    // 自動嘗試取得位置
    getCurrentLocation();
  }, []);

  const features = [
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '精確定位',
      description: '使用GPS定位技術，快速找到最近的廁所',
    },
    {
      icon: <AccessibleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '無障礙友善',
      description: '詳細的無障礙設施資訊，讓每個人都能輕鬆使用',
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '智慧搜尋',
      description: '支援關鍵字搜尋、篩選條件，快速找到符合需求的廁所',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '安全可靠',
      description: '資料來源於環保署官方API，資訊準確可靠',
    },
  ];

  const quickActions = [
    {
      title: '搜尋附近廁所',
      description: '根據您的位置找到最近的廁所',
      action: () => navigate('/search'),
      icon: <SearchIcon />,
      color: 'primary' as const,
    },
    {
      title: '無障礙廁所',
      description: '專門為身心障礙人士設計的廁所',
      action: () => navigate('/search?type=無障礙廁所'),
      icon: <AccessibleIcon />,
      color: 'secondary' as const,
    },
    {
      title: '我的收藏',
      description: '查看您收藏的廁所',
      action: () => navigate('/favorites'),
      icon: <FavoriteIcon />,
      color: 'success' as const,
    },
  ];

  return (
    <Box>
      {/* 主要橫幅區域 */}
      <Paper
        elevation={3}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            無障礙廁所GO V2
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
            }}
          >
            為身心障礙人士提供最便利的廁所查詢服務
          </Typography>
          
          {/* 搜尋列 */}
          <Box sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            <SearchBar />
          </Box>

          {/* 位置按鈕 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={getCurrentLocation}
              disabled={isLoadingLocation || locationLoading}
              startIcon={isLoadingLocation ? <CircularProgress size={20} /> : <LocationIcon />}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              {isLoadingLocation ? '取得位置中...' : '取得我的位置'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/search')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              瀏覽所有廁所
            </Button>
          </Box>

          {/* 位置狀態提示 */}
          {userLocation && (
            <Alert
              severity="success"
              sx={{
                mt: 3,
                maxWidth: 400,
                mx: 'auto',
                backgroundColor: 'rgba(76,175,80,0.2)',
                color: 'white',
                border: '1px solid rgba(76,175,80,0.3)',
              }}
            >
              位置已取得！緯度: {userLocation.latitude.toFixed(6)}, 經度: {userLocation.longitude.toFixed(6)}
            </Alert>
          )}

          {locationError && (
            <Alert
              severity="warning"
              sx={{
                mt: 3,
                maxWidth: 400,
                mx: 'auto',
                backgroundColor: 'rgba(255,152,0,0.2)',
                color: 'white',
                border: '1px solid rgba(255,152,0,0.3)',
              }}
            >
              {locationError}
            </Alert>
          )}
        </Container>
      </Paper>

      <Container maxWidth="lg">
        {/* 快速操作 */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}
          >
            快速操作
          </Typography>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                  onClick={action.action}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      action.action();
                    }
                  }}
                  aria-label={`${action.title}: ${action.description}`}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      {action.icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 功能特色 */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}
          >
            功能特色
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 統計資訊 */}
        <Box sx={{ mb: 6 }}>
          <QuickStats />
        </Box>

        {/* 地圖預覽 */}
        {userLocation && (
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}
            >
              附近廁所地圖
            </Typography>
            <Paper elevation={3} sx={{ height: 400, borderRadius: 2, overflow: 'hidden' }}>
              <MapComponent
                center={{
                  lat: userLocation.latitude,
                  lng: userLocation.longitude,
                }}
                zoom={15}
                showUserLocation={true}
                height="400px"
              />
            </Paper>
          </Box>
        )}
      </Container>

      {/* 無障礙設定浮動按鈕 */}
      <Fab
        color="primary"
        aria-label="無障礙設定"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
        onClick={() => navigate('/accessibility')}
      >
        <AccessibleIcon />
      </Fab>
    </Box>
  );
};

export default HomePage;
