import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Accessible as AccessibleIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface StatItem {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const QuickStats: React.FC = () => {
  // 模擬統計資料（實際應該從API取得）
  const stats: StatItem[] = [
    {
      title: '總廁所數量',
      value: '46,121',
      icon: <LocationIcon />,
      description: '全台公共廁所總數',
      trend: {
        value: 5.2,
        isPositive: true,
      },
      color: 'primary',
    },
    {
      title: '無障礙廁所',
      value: '12,847',
      icon: <AccessibleIcon />,
      description: '符合無障礙標準的廁所',
      trend: {
        value: 8.7,
        isPositive: true,
      },
      color: 'success',
    },
    {
      title: '特優級廁所',
      value: '8,234',
      icon: <StarIcon />,
      description: '評等為特優級的廁所',
      trend: {
        value: 3.1,
        isPositive: true,
      },
      color: 'warning',
    },
    {
      title: '本月新增',
      value: '127',
      icon: <TrendingIcon />,
      description: '本月新增的廁所數量',
      trend: {
        value: 12.5,
        isPositive: true,
      },
      color: 'secondary',
    },
  ];

  const getColorValue = (color: StatItem['color']) => {
    switch (color) {
      case 'primary':
        return '#1976d2';
      case 'secondary':
        return '#dc004e';
      case 'success':
        return '#4caf50';
      case 'warning':
        return '#ff9800';
      case 'error':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const formatValue = (value: string | number): string => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: 'bold' }}
        >
          統計資訊
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="重新整理統計資料">
            <IconButton size="small" aria-label="重新整理統計資料">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="關於統計資料">
            <IconButton size="small" aria-label="關於統計資料">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'visible',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              role="article"
              aria-labelledby={`stat-title-${index}`}
              aria-describedby={`stat-description-${index}`}
            >
              {/* 裝飾性背景 */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  backgroundColor: getColorValue(stat.color) + '10',
                  borderRadius: '0 8px 0 100%',
                }}
              />
              
              <CardContent sx={{ p: 3, position: 'relative' }}>
                {/* 圖示 */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: getColorValue(stat.color) + '15',
                    color: getColorValue(stat.color),
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Box>

                {/* 標題 */}
                <Typography
                  id={`stat-title-${index}`}
                  variant="h4"
                  component="h3"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    color: getColorValue(stat.color),
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  {formatValue(stat.value)}
                </Typography>

                {/* 描述 */}
                <Typography
                  id={`stat-description-${index}`}
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, minHeight: 40 }}
                >
                  {stat.description}
                </Typography>

                {/* 趨勢指標 */}
                {stat.trend && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: stat.trend.isPositive ? 'success.main' : 'error.main',
                    }}
                  >
                    <TrendingIcon
                      sx={{
                        fontSize: 16,
                        transform: stat.trend.isPositive ? 'none' : 'rotate(180deg)',
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {stat.trend.isPositive ? '+' : ''}{stat.trend.value}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      較上月
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 資料來源說明 */}
      <Box sx={{ mt: 4, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          資料來源：行政院環境保護署公共廁所資料庫 | 
          最後更新：2024年1月 | 
          <Typography
            component="span"
            variant="body2"
            color="primary.main"
            sx={{ cursor: 'pointer', textDecoration: 'underline', ml: 1 }}
          >
            查看詳細統計
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default QuickStats;
