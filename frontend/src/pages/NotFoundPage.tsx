import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: '回到首頁',
      description: '返回網站首頁',
      action: () => navigate('/'),
      icon: <HomeIcon />,
      color: 'primary' as const,
    },
    {
      title: '搜尋廁所',
      description: '尋找附近的廁所',
      action: () => navigate('/search'),
      icon: <SearchIcon />,
      color: 'secondary' as const,
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <ErrorIcon sx={{ fontSize: 120, color: 'error.main', mb: 3 }} />
        
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          頁面不存在
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          抱歉，您要尋找的頁面不存在或已被移除
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          返回上一頁
        </Button>
      </Box>

      {/* 快速操作 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          快速操作
        </Typography>
        
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
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
                  <Box sx={{ mb: 2, color: `${action.color}.main` }}>
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
      </Paper>

      {/* 幫助資訊 */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          需要幫助？
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          如果您認為這是一個錯誤，或者需要其他協助，請聯絡我們的技術支援團隊
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            href="mailto:support@accessible-toilet-go.com"
            sx={{ mr: 2 }}
          >
            聯絡支援
          </Button>
          <Button
            variant="outlined"
            href="/about"
          >
            關於我們
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
