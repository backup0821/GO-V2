import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Rating,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Directions as DirectionsIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  Accessible as AccessibleIcon,
  ChildCare as ChildCareIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useGetToiletByIdQuery } from '../store/api/toiletApi';
import { addFavoriteToilet, removeFavoriteToilet } from '../store/slices/searchSlice';
import MapComponent from '../components/Map/MapComponent';

const ToiletDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { favoriteToilets } = useSelector((state: RootState) => state.search);
  
  const { data: toilet, isLoading, error } = useGetToiletByIdQuery(id || '');

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !toilet) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          找不到指定的廁所資訊
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          返回
        </Button>
      </Container>
    );
  }

  const isFavorite = favoriteToilets.includes(toilet.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavoriteToilet(toilet.id));
    } else {
      dispatch(addFavoriteToilet(toilet.id));
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: toilet.name,
          text: `發現一個不錯的廁所：${toilet.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('分享失敗:', error);
      }
    } else {
      // 複製連結到剪貼板
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getGradeColor = (grade: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    switch (grade) {
      case '特優級':
        return 'success';
      case '優級':
        return 'info';
      case '良級':
        return 'warning';
      case '普通級':
        return 'default';
      case '不合格':
        return 'error';
      default:
        return 'default';
    }
  };

  const getGradeStars = (grade: string): number => {
    switch (grade) {
      case '特優級':
        return 5;
      case '優級':
        return 4;
      case '良級':
        return 3;
      case '普通級':
        return 2;
      case '不合格':
        return 1;
      default:
        return 0;
    }
  };

  // 模擬評論資料
  const reviews = [
    {
      id: '1',
      user: '使用者A',
      rating: 5,
      comment: '設施很新，無障礙設施完善，使用體驗很好！',
      date: '2024-01-15',
    },
    {
      id: '2',
      user: '使用者B',
      rating: 4,
      comment: '位置方便，但偶爾需要排隊。',
      date: '2024-01-10',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* 返回按鈕 */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          返回搜尋結果
        </Button>
      </Box>

      {/* 主要資訊 */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {toilet.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationIcon color="action" />
              <Typography variant="body1" color="text.secondary">
                {toilet.address}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              <Chip
                label={toilet.type}
                color={toilet.type.includes('無障礙') ? 'success' : 'default'}
                icon={toilet.type.includes('無障礙') ? <AccessibleIcon /> : undefined}
              />
              <Chip
                label={toilet.grade}
                color={getGradeColor(toilet.grade)}
                icon={<StarIcon />}
              />
              <Chip
                label={toilet.category}
                variant="outlined"
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={handleToggleFavorite}
              aria-label={isFavorite ? '取消收藏' : '加入收藏'}
              color={isFavorite ? 'error' : 'default'}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton onClick={handleShare} aria-label="分享">
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* 基本資訊 */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              基本資訊
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="管理單位"
                  secondary={toilet.management}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText
                  primary="等級評分"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={getGradeStars(toilet.grade)}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {toilet.grade}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {toilet.hasDiaperTable && (
                <ListItem>
                  <ListItemIcon>
                    <ChildCareIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="尿布檯"
                    secondary="設有尿布更換台"
                  />
                </ListItem>
              )}
            </List>
          </Grid>

          {/* 無障礙設施 */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              無障礙設施
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <AccessibleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="無障礙設計"
                  secondary={toilet.type.includes('無障礙') ? '符合無障礙標準' : '一般設計'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="緊急求助"
                  secondary="設有緊急按鈕"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationIcon />
                </ListItemIcon>
                <ListItemText
                  primary="位置資訊"
                  secondary={`緯度: ${toilet.latitude.toFixed(6)}, 經度: ${toilet.longitude.toFixed(6)}`}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        {/* 操作按鈕 */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<DirectionsIcon />}
            onClick={() => {
              // TODO: 開啟導航功能
              const url = `https://www.google.com/maps/dir/?api=1&destination=${toilet.latitude},${toilet.longitude}`;
              window.open(url, '_blank');
            }}
          >
            開始導航
          </Button>
          <Button
            variant="outlined"
            startIcon={<LocationIcon />}
            onClick={() => {
              // TODO: 在地圖上顯示位置
            }}
          >
            在地圖上查看
          </Button>
        </Box>
      </Paper>

      {/* 地圖 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          位置地圖
        </Typography>
        <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden' }}>
          <MapComponent
            center={{
              lat: toilet.latitude,
              lng: toilet.longitude,
            }}
            zoom={16}
            markers={[{
              id: toilet.id,
              position: {
                lat: toilet.latitude,
                lng: toilet.longitude,
              },
              title: toilet.name,
              type: toilet.type,
              grade: toilet.grade,
            }]}
            height="300px"
          />
        </Box>
      </Paper>

      {/* 使用者評論 */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          使用者評論
        </Typography>
        
        {reviews.length > 0 ? (
          <List>
            {reviews.map((review, index) => (
              <React.Fragment key={review.id}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <Avatar sx={{ backgroundColor: 'primary.main' }}>
                      {review.user.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {review.user}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {review.date}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {review.comment}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < reviews.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Alert severity="info">
            暫無使用者評論
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default ToiletDetailPage;
