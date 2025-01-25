import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';

interface RootState {
  auth: {
    user: {
      id: string;
      email: string;
    } | null;
    loading: boolean;
  };
}

const drawerWidth = 240;

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Gold Wallet', icon: <AccountBalanceWalletIcon />, path: '/wallet' },
  { text: 'Gaming Sessions', icon: <SportsEsportsIcon />, path: '/sessions' },
  { text: 'Leaderboard', icon: <LeaderboardIcon />, path: '/leaderboard' },
  { text: 'Social', icon: <GroupIcon />, path: '/social' },
  { text: 'Global Chat', icon: <ChatIcon />, path: '/chat' },
  { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
];

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ bgcolor: 'background.paper', height: '100%' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main' }}>
          GoldGames
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) handleDrawerToggle();
            }}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
                cursor: 'pointer'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{ '& .MuiListItemText-primary': { color: 'text.primary' } }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main' }}>
            GoldGames
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}