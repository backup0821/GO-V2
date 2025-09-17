import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Accessible as AccessibleIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setHighContrast, setLargeText } from '../../store/slices/accessibilitySlice';

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  
  const { highContrast, settings } = useSelector((state: RootState) => state.accessibility);
  const { favoriteToilets, searchHistory } = useSelector((state: RootState) => state.search);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const toggleHighContrast = () => {
    dispatch(setHighContrast(!highContrast));
  };

  const toggleLargeText = () => {
    dispatch(setLargeText(!settings.largeText));
  };

  const drawerWidth = 280;

  const navigationItems = [
    { text: '首頁', icon: <HomeIcon />, path: '/' },
    { text: '搜尋廁所', icon: <SearchIcon />, path: '/search' },
    { text: '無障礙設定', icon: <AccessibleIcon />, path: '/accessibility' },
    { text: '關於我們', icon: <InfoIcon />, path: '/about' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          無障礙廁所GO
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component="a"
              href={item.path}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.primary.light + '20',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Badge badgeContent={favoriteToilets.length} color="secondary">
                <FavoriteIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="我的收藏" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Badge badgeContent={searchHistory.length} color="secondary">
                <HistoryIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="搜尋歷史" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 應用程式標題列 */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: highContrast ? '#000000' : theme.palette.primary.main,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="開啟選單"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            無障礙廁所GO V2
          </Typography>
          
          {/* 位置按鈕 */}
          <IconButton color="inherit" aria-label="取得位置">
            <LocationIcon />
          </IconButton>
          
          {/* 設定選單 */}
          <IconButton
            color="inherit"
            aria-label="開啟設定"
            onClick={handleSettingsClick}
          >
            <SettingsIcon />
          </IconButton>
          
          <Menu
            anchorEl={settingsAnchor}
            open={Boolean(settingsAnchor)}
            onClose={handleSettingsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={toggleHighContrast}>
              <ListItemIcon>
                {highContrast ? <LightModeIcon /> : <DarkModeIcon />}
              </ListItemIcon>
              <ListItemText primary={highContrast ? '關閉高對比' : '開啟高對比'} />
            </MenuItem>
            <MenuItem onClick={toggleLargeText}>
              <ListItemIcon>
                <Typography sx={{ fontSize: settings.largeText ? '1.5em' : '1em' }}>A</Typography>
              </ListItemIcon>
              <ListItemText primary={settings.largeText ? '關閉大字體' : '開啟大字體'} />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* 側邊欄抽屜 */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="導航選單"
      >
        {/* 行動版抽屜 */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // 在行動裝置上保持效能
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: highContrast ? '#000000' : theme.palette.background.paper,
              color: highContrast ? '#ffffff' : theme.palette.text.primary,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* 桌面版抽屜 */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: highContrast ? '#000000' : theme.palette.background.paper,
              color: highContrast ? '#ffffff' : theme.palette.text.primary,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* 主要內容區域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px', // AppBar高度
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: highContrast ? '#000000' : theme.palette.background.default,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
