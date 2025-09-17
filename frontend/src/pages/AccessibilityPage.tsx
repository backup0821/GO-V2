import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Accessibility as AccessibilityIcon,
  Visibility as VisibilityIcon,
  Hearing as HearingIcon,
  TouchApp as TouchAppIcon,
  Keyboard as KeyboardIcon,
  HighContrast as HighContrastIcon,
  ZoomIn as ZoomInIcon,
  Speed as SpeedIcon,
  Palette as PaletteIcon,
  VolumeUp as VolumeUpIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  setHighContrast,
  setLargeText,
  setScreenReader,
  setKeyboardNavigation,
  setReducedMotion,
  setColorBlindFriendly,
  setVoiceAnnouncements,
  setFontSize,
  resetAccessibilitySettings,
} from '../store/slices/accessibilitySlice';

const AccessibilityPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    highContrast,
    settings,
    fontSize,
    reducedMotion,
    colorBlindFriendly,
    voiceAnnouncements,
  } = useSelector((state: RootState) => state.accessibility);

  // 無障礙功能說明
  const accessibilityFeatures = [
    {
      icon: <HighContrastIcon />,
      title: '高對比模式',
      description: '提高文字和背景的對比度，讓內容更容易閱讀',
      benefits: ['適合視力較弱的使用者', '減少眼部疲勞', '提高可讀性'],
    },
    {
      icon: <ZoomInIcon />,
      title: '大字體模式',
      description: '放大網頁文字大小，讓內容更容易閱讀',
      benefits: ['適合閱讀困難的使用者', '減少眼部壓力', '提高閱讀效率'],
    },
    {
      icon: <HearingIcon />,
      title: '螢幕閱讀器支援',
      description: '為螢幕閱讀器提供完整的語義標記和描述',
      benefits: ['支援NVDA、JAWS等軟體', '完整的ARIA標籤', '語音導航'],
    },
    {
      icon: <KeyboardIcon />,
      title: '鍵盤導航',
      description: '所有功能都可以透過鍵盤操作，支援Tab鍵導航',
      benefits: ['適合行動不便的使用者', '快速鍵盤操作', '清楚的焦點指示'],
    },
    {
      icon: <SpeedIcon />,
      title: '減少動畫',
      description: '減少或停用動畫效果，避免引起不適',
      benefits: ['適合對動畫敏感的使用者', '減少注意力分散', '提高專注度'],
    },
    {
      icon: <PaletteIcon />,
      title: '色彩盲友善',
      description: '調整色彩配置，讓色彩盲使用者更容易識別',
      benefits: ['支援紅綠色盲', '提高色彩識別度', '更好的視覺體驗'],
    },
  ];

  // 鍵盤快捷鍵
  const keyboardShortcuts = [
    { key: 'Tab', description: '在可聚焦元素間移動' },
    { key: 'Shift + Tab', description: '反向移動焦點' },
    { key: 'Enter', description: '啟動按鈕或連結' },
    { key: 'Space', description: '選擇或切換選項' },
    { key: 'Esc', description: '關閉對話框或選單' },
    { key: 'Alt + 1', description: '跳轉到主要內容' },
    { key: 'Alt + 2', description: '跳轉到導航選單' },
    { key: 'Alt + 3', description: '跳轉到搜尋功能' },
  ];

  // 輔助技術相容性
  const assistiveTechnologies = [
    { name: 'NVDA', type: '螢幕閱讀器', status: '完全支援', description: '免費的開源螢幕閱讀器' },
    { name: 'JAWS', type: '螢幕閱讀器', status: '完全支援', description: '專業的螢幕閱讀器軟體' },
    { name: 'VoiceOver', type: '螢幕閱讀器', status: '完全支援', description: 'macOS內建螢幕閱讀器' },
    { name: 'TalkBack', type: '螢幕閱讀器', status: '完全支援', description: 'Android內建螢幕閱讀器' },
    { name: 'Dragon', type: '語音控制', status: '部分支援', description: '語音輸入和導航' },
    { name: 'ZoomText', type: '放大軟體', status: '完全支援', description: '螢幕放大和閱讀輔助' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* 頁面標題 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <AccessibilityIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          無障礙設定
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          我們致力於為所有使用者提供最佳的瀏覽體驗，無論您使用何種輔助技術
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* 左側：設定選項 */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 4, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              個人化設定
            </Typography>

            {/* 視覺設定 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                視覺設定
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={highContrast}
                    onChange={(e) => dispatch(setHighContrast(e.target.checked))}
                  />
                }
                label="高對比模式"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.largeText}
                    onChange={(e) => dispatch(setLargeText(e.target.checked))}
                  />
                }
                label="大字體模式"
                sx={{ mb: 3 }}
              />

              <Typography gutterBottom>
                字體大小調整: {Math.round(fontSize * 100)}%
              </Typography>
              <Slider
                value={fontSize}
                onChange={(_, value) => dispatch(setFontSize(value as number))}
                min={0.75}
                max={2}
                step={0.25}
                marks={[
                  { value: 0.75, label: '75%' },
                  { value: 1, label: '100%' },
                  { value: 1.25, label: '125%' },
                  { value: 1.5, label: '150%' },
                  { value: 2, label: '200%' },
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 互動設定 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                互動設定
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.keyboardNavigation}
                    onChange={(e) => dispatch(setKeyboardNavigation(e.target.checked))}
                  />
                }
                label="強化鍵盤導航"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={reducedMotion}
                    onChange={(e) => dispatch(setReducedMotion(e.target.checked))}
                  />
                }
                label="減少動畫效果"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={colorBlindFriendly}
                    onChange={(e) => dispatch(setColorBlindFriendly(e.target.checked))}
                  />
                }
                label="色彩盲友善模式"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={voiceAnnouncements}
                    onChange={(e) => dispatch(setVoiceAnnouncements(e.target.checked))}
                  />
                }
                label="語音提示"
                sx={{ mb: 2 }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 螢幕閱讀器設定 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                螢幕閱讀器設定
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.screenReader}
                    onChange={(e) => dispatch(setScreenReader(e.target.checked))}
                  />
                }
                label="螢幕閱讀器模式"
                sx={{ mb: 2 }}
              />
              
              <Alert severity="info" sx={{ mt: 2 }}>
                啟用螢幕閱讀器模式後，頁面會自動調整為最佳的可訪問性格式
              </Alert>
            </Box>

            {/* 重設按鈕 */}
            <Box sx={{ textAlign: 'center', pt: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => dispatch(resetAccessibilitySettings())}
                sx={{ minWidth: 120 }}
              >
                重設所有設定
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* 右側：說明和資訊 */}
        <Grid item xs={12} lg={6}>
          {/* 無障礙功能說明 */}
          <Paper sx={{ p: 4, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              無障礙功能說明
            </Typography>
            
            <Grid container spacing={2}>
              {accessibilityFeatures.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ color: 'primary.main', mr: 1 }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {feature.description}
                      </Typography>
                      <List dense>
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <ListItem key={benefitIndex} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 20 }}>
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  backgroundColor: 'primary.main',
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={benefit}
                              primaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* 鍵盤快捷鍵 */}
          <Paper sx={{ p: 4, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              鍵盤快捷鍵
            </Typography>
            
            <Grid container spacing={2}>
              {keyboardShortcuts.map((shortcut, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                    <Chip
                      label={shortcut.key}
                      size="small"
                      color="primary"
                      sx={{ mr: 2, fontFamily: 'monospace' }}
                    />
                    <Typography variant="body2">
                      {shortcut.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* 輔助技術相容性 */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                輔助技術相容性
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {assistiveTechnologies.map((tech, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {tech.name}
                          </Typography>
                          <Chip
                            label={tech.status}
                            size="small"
                            color={tech.status === '完全支援' ? 'success' : 'warning'}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {tech.type}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {tech.description}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* 無障礙標準說明 */}
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <InfoIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            無障礙標準遵循
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  WCAG 2.1 AA
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  遵循Web內容無障礙指南2.1 AA級標準
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  語義化HTML
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  使用正確的HTML標籤和ARIA屬性
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  鍵盤導航
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  所有功能都支援鍵盤操作
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AccessibilityPage;
