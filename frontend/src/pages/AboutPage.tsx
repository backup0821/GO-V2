import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Button,
  Link,
} from '@mui/material';
import {
  Info as InfoIcon,
  Group as GroupIcon,
  Code as CodeIcon,
  Public as PublicIcon,
  Email as EmailIcon,
  GitHub as GitHubIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Accessible as AccessibleIcon,
  Favorite as FavoriteIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'LKJH MAKER 鹿中創客',
      role: '專案開發團隊',
      avatar: '👨‍💻',
      description: '致力於開發無障礙友善的數位解決方案',
    },
  ];

  const features = [
    {
      icon: <AccessibleIcon />,
      title: '無障礙設計',
      description: '遵循WCAG 2.1 AA級標準，確保所有使用者都能輕鬆使用',
    },
    {
      icon: <PublicIcon />,
      title: '開放資料',
      description: '使用環保署官方API，資料準確且即時更新',
    },
    {
      icon: <CodeIcon />,
      title: '開源專案',
      description: '採用創用CC授權，歡迎社群參與和貢獻',
    },
    {
      icon: <FavoriteIcon />,
      title: '社會責任',
      description: '為身心障礙人士提供更好的生活品質',
    },
  ];

  const technologies = [
    { name: 'React 18', category: '前端框架' },
    { name: 'TypeScript', category: '程式語言' },
    { name: 'Material-UI', category: 'UI框架' },
    { name: 'Redux Toolkit', category: '狀態管理' },
    { name: 'Google Maps API', category: '地圖服務' },
    { name: 'Node.js', category: '後端框架' },
    { name: 'PostgreSQL', category: '資料庫' },
    { name: 'Docker', category: '容器化' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* 頁面標題 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <InfoIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          關於我們
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          無障礙廁所GO V2 是一個專為身心障礙人士設計的友善服務平台
        </Typography>
      </Box>

      {/* 專案介紹 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          專案介紹
        </Typography>
        <Typography variant="body1" paragraph>
          無障礙廁所GO V2 是我們團隊為身心障礙人士特別開發的網站應用程式。
          透過整合環保署的公共廁所資料庫，我們提供即時、準確的廁所查詢服務，
          幫助使用者快速找到最近且符合需求的廁所設施。
        </Typography>
        <Typography variant="body1" paragraph>
          我們的目標是建立一個真正無障礙的數位環境，讓每個人都能享有平等的資訊存取權。
          無論是視覺障礙、行動不便或其他特殊需求的使用者，都能透過我們的平台輕鬆找到適合的廁所設施。
        </Typography>
        <Typography variant="body1">
          這個專案採用最新的網頁技術開發，並嚴格遵循無障礙設計標準，
          確保所有功能都能透過各種輔助技術正常使用。
        </Typography>
      </Paper>

      {/* 核心特色 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          核心特色
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        mr: 2,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* 技術架構 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          技術架構
        </Typography>
        <Typography variant="body1" paragraph>
          本專案採用現代化的技術棧，確保高效能、可擴展性和維護性：
        </Typography>
        
        <Grid container spacing={2}>
          {technologies.map((tech, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Chip
                label={tech.name}
                variant="outlined"
                color="primary"
                sx={{ width: '100%', mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
                {tech.category}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* 開發團隊 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          開發團隊
        </Typography>
        <Grid container spacing={3}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    fontSize: '2rem',
                    backgroundColor: 'primary.main',
                  }}
                >
                  {member.avatar}
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {member.name}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {member.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* 無障礙承諾 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          無障礙承諾
        </Typography>
        <Typography variant="body1" paragraph>
          我們承諾為所有使用者提供無障礙的數位體驗。我們的平台：
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <AccessibleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="遵循WCAG 2.1 AA級無障礙標準"
              secondary="確保內容對所有使用者都可存取"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccessibleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="支援各種輔助技術"
              secondary="包括螢幕閱讀器、語音控制、鍵盤導航等"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccessibleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="提供多種無障礙設定選項"
              secondary="讓使用者根據個人需求調整介面"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccessibleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="持續改善使用者體驗"
              secondary="定期收集回饋並優化無障礙功能"
            />
          </ListItem>
        </List>
      </Paper>

      {/* 聯絡資訊 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          聯絡我們
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="電子郵件"
                  secondary={
                    <Link href="mailto:contact@lkjh-maker.com" color="primary">
                      contact@lkjh-maker.com
                    </Link>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <GitHubIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="GitHub"
                  secondary={
                    <Link
                      href="https://github.com/lkjh-maker/accessible-toilet-go-v2"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                    >
                      專案儲存庫
                    </Link>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PublicIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="官方網站"
                  secondary={
                    <Link
                      href="https://lkjh-maker.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                    >
                      lkjh-maker.com
                    </Link>
                  }
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                回饋與建議
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                我們非常重視使用者的意見和建議。如果您在使用過程中遇到任何問題，
                或對無障礙功能有改善建議，請隨時與我們聯絡。
              </Typography>
              <Button
                variant="contained"
                href="mailto:feedback@lkjh-maker.com"
                startIcon={<EmailIcon />}
              >
                提供回饋
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 授權資訊 */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          授權資訊
        </Typography>
        
        <Box sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body1" paragraph>
            本專案採用 <strong>創用CC 姓名標示-非商業性 4.0 國際</strong> 授權條款。
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            您可自由：
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="分享 — 以任何媒介或格式重製及散布本素材" />
            </ListItem>
            <ListItem>
              <ListItemText primary="修改 — 重混、轉換本素材、及依本素材建立新素材" />
            </ListItem>
          </List>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            惟須遵守下列條件：
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="姓名標示 — 您必須給予適當表彰、提供指向本授權條款的連結" />
            </ListItem>
            <ListItem>
              <ListItemText primary="非商業性 — 您不得將本素材用於商業目的" />
            </ListItem>
          </List>
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              href="https://creativecommons.org/licenses/by-nc/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<PublicIcon />}
            >
              查看完整授權條款
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutPage;
