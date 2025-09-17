import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Alert,
  CircularProgress,
  Pagination,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  LocationOn as LocationIcon,
  Accessible as AccessibleIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Directions as DirectionsIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { useSearchNearbyToiletsQuery } from '../store/api/toiletApi';
import { setSearchKeyword, updateFilter, setSortBy } from '../store/slices/searchSlice';
import { Toilet } from '../types';
import MapComponent from '../components/Map/MapComponent';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('q') || '');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedToilet, setSelectedToilet] = useState<Toilet | null>(null);
  
  const { userLocation, searchParams: reduxSearchParams } = useSelector((state: RootState) => state.search);
  const { favoriteToilets } = useSelector((state: RootState) => state.search);

  // 搜尋參數
  const searchQuery = {
    keyword: searchKeyword,
    location: userLocation,
    filters: reduxSearchParams.filters,
    sortBy: reduxSearchParams.sortBy,
    limit: 20,
  };

  const { data: searchResults, isLoading, error } = useSearchNearbyToiletsQuery(searchQuery);

  // 初始化搜尋
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchKeyword(query);
      dispatch(setSearchKeyword(query));
    }
  }, [searchParams, dispatch]);

  // 處理搜尋
  const handleSearch = () => {
    dispatch(setSearchKeyword(searchKeyword));
    setSearchParams({ q: searchKeyword });
  };

  // 處理篩選變更
  const handleFilterChange = (key: string, value: any) => {
    dispatch(updateFilter({ key: key as any, value }));
  };

  // 處理排序變更
  const handleSortChange = (sortBy: 'distance' | 'grade' | 'name') => {
    dispatch(setSortBy(sortBy));
  };

  // 取得廁所類型圖示
  const getToiletTypeIcon = (type: string) => {
    if (type.includes('無障礙')) {
      return <AccessibleIcon color="success" />;
    }
    return <LocationIcon color="primary" />;
  };

  // 取得等級顏色
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

  // 格式化距離
  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  // 廁所卡片元件
  const ToiletCard: React.FC<{ toilet: Toilet }> = ({ toilet }) => (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea
        onClick={() => setSelectedToilet(toilet)}
        sx={{ height: '100%', p: 2 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getToiletTypeIcon(toilet.type)}
            <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>
              {toilet.name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: 處理收藏功能
            }}
            aria-label={favoriteToilets.includes(toilet.id) ? '取消收藏' : '加入收藏'}
          >
            {favoriteToilets.includes(toilet.id) ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {toilet.address}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={toilet.type}
            size="small"
            color={toilet.type.includes('無障礙') ? 'success' : 'default'}
          />
          <Chip
            label={toilet.grade}
            size="small"
            color={getGradeColor(toilet.grade)}
          />
          <Chip
            label={toilet.category}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {toilet.management}
          </Typography>
          {toilet.distance && (
            <Chip
              label={formatDistance(toilet.distance)}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        {toilet.hasDiaperTable && (
          <Chip
            label="尿布檯"
            size="small"
            color="info"
            sx={{ mt: 1 }}
          />
        )}
      </CardActionArea>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* 頁面標題 */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        搜尋廁所
      </Typography>

      <Grid container spacing={3}>
        {/* 左側搜尋和篩選 */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {/* 搜尋列 */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <TextField
                fullWidth
                placeholder="搜尋廁所名稱或地址..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={isLoading}
                sx={{ minWidth: 100 }}
              >
                搜尋
              </Button>
            </Box>

            {/* 快速篩選 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                快速篩選
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="無障礙廁所"
                  onClick={() => handleFilterChange('type', ['無障礙廁所'])}
                  color={reduxSearchParams.filters?.type?.includes('無障礙廁所') ? 'primary' : 'default'}
                  variant={reduxSearchParams.filters?.type?.includes('無障礙廁所') ? 'filled' : 'outlined'}
                />
                <Chip
                  label="特優級"
                  onClick={() => handleFilterChange('grade', ['特優級'])}
                  color={reduxSearchParams.filters?.grade?.includes('特優級') ? 'primary' : 'default'}
                  variant={reduxSearchParams.filters?.grade?.includes('特優級') ? 'filled' : 'outlined'}
                />
                <Chip
                  label="有尿布檯"
                  onClick={() => handleFilterChange('hasDiaperTable', true)}
                  color={reduxSearchParams.filters?.hasDiaperTable ? 'primary' : 'default'}
                  variant={reduxSearchParams.filters?.hasDiaperTable ? 'filled' : 'outlined'}
                />
              </Box>
            </Box>

            {/* 排序選項 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                排序方式
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={reduxSearchParams.sortBy || 'distance'}
                  onChange={(e) => handleSortChange(e.target.value as any)}
                >
                  <MenuItem value="distance">距離</MenuItem>
                  <MenuItem value="grade">等級</MenuItem>
                  <MenuItem value="name">名稱</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* 距離範圍 */}
            <Box>
              <Typography variant="h6" gutterBottom>
                搜尋範圍
              </Typography>
              <Slider
                value={reduxSearchParams.filters?.maxDistance || 1000}
                onChange={(_, value) => handleFilterChange('maxDistance', value)}
                min={100}
                max={5000}
                step={100}
                marks={[
                  { value: 100, label: '100m' },
                  { value: 1000, label: '1km' },
                  { value: 5000, label: '5km' },
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}m`}
              />
            </Box>
          </Paper>

          {/* 位置資訊 */}
          {userLocation && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                您的位置
              </Typography>
              <Typography variant="body2" color="text.secondary">
                緯度: {userLocation.latitude.toFixed(6)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                經度: {userLocation.longitude.toFixed(6)}
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* 右側搜尋結果 */}
        <Grid item xs={12} lg={8}>
          {/* 搜尋結果標題 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {isLoading ? '搜尋中...' : `找到 ${searchResults?.total || 0} 間廁所`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setFilterDrawerOpen(true)}
                sx={{ display: { lg: 'none' } }}
              >
                篩選
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => window.location.reload()}
                disabled={isLoading}
              >
                重新整理
              </Button>
            </Box>
          </Box>

          {/* 載入狀態 */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* 錯誤狀態 */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              搜尋失敗，請稍後再試
            </Alert>
          )}

          {/* 搜尋結果 */}
          {searchResults && !isLoading && (
            <>
              <Grid container spacing={3}>
                {searchResults.toilets.map((toilet) => (
                  <Grid item xs={12} sm={6} key={toilet.id}>
                    <ToiletCard toilet={toilet} />
                  </Grid>
                ))}
              </Grid>

              {/* 分頁 */}
              {searchResults.hasMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination count={10} page={1} />
                </Box>
              )}
            </>
          )}

          {/* 無結果 */}
          {searchResults && searchResults.toilets.length === 0 && !isLoading && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <LocationIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                找不到符合條件的廁所
              </Typography>
              <Typography variant="body2" color="text.secondary">
                請嘗試調整搜尋條件或擴大搜尋範圍
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* 選中廁所的詳細資訊抽屜 */}
      <Drawer
        anchor="bottom"
        open={!!selectedToilet}
        onClose={() => setSelectedToilet(null)}
        sx={{ '& .MuiDrawer-paper': { height: '50vh' } }}
      >
        {selectedToilet && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                {selectedToilet.name}
              </Typography>
              <IconButton onClick={() => setSelectedToilet(null)}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedToilet.address}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={selectedToilet.type} color="primary" />
              <Chip label={selectedToilet.grade} color={getGradeColor(selectedToilet.grade)} />
              <Chip label={selectedToilet.category} variant="outlined" />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<DirectionsIcon />}
                onClick={() => {
                  // TODO: 開啟導航
                }}
              >
                導航
              </Button>
              <Button
                variant="outlined"
                startIcon={<InfoIcon />}
                onClick={() => navigate(`/toilet/${selectedToilet.id}`)}
              >
                詳細資訊
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Container>
  );
};

export default SearchPage;
