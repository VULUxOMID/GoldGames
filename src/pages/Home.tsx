import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { cardStyles, gradientText, glowEffect } from '../theme/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Gold Wallet',
    description: 'Manage your gaming gold with our secure wallet system',
    path: '/wallet'
  },
  {
    icon: <SportsEsportsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Gaming Sessions',
    description: 'Join exciting gaming sessions and earn rewards',
    path: '/sessions'
  },
  {
    icon: <LeaderboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Leaderboard',
    description: 'Compete with others and climb the rankings',
    path: '/leaderboard'
  },
  {
    icon: <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Social',
    description: 'Connect with fellow gamers and build your network',
    path: '/social'
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 8, mt: 4 }}>
        <Typography variant="h1" sx={{ ...gradientText, mb: 2 }}>
          Welcome to GoldGames
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Your Premier Gaming Rewards Platform
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            ...glowEffect,
            fontSize: '1.2rem',
            py: 2,
            px: 4,
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.dark' }
          }}
          onClick={() => navigate('/sessions')}
        >
          Start Gaming
        </Button>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <Card
              sx={{
                ...cardStyles,
                height: '100%',
                cursor: 'pointer',
                backgroundColor: 'background.paper'
              }}
              onClick={() => navigate(feature.path)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}      
      </Grid>
    </Container>
  );
}