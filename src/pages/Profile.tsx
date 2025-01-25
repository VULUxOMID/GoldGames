import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { gradientText, cardStyles } from '../theme/styles';
import EditIcon from '@mui/icons-material/Edit';

interface UserProfile {
  username: string;
  email: string;
  avatar: string;
  totalGold: number;
  gamesPlayed: number;
  winRate: number;
}

const mockProfile: UserProfile = {
  username: 'GoldMaster',
  email: 'user@example.com',
  avatar: '',
  totalGold: 25000,
  gamesPlayed: 100,
  winRate: 65
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, _setProfile] = useState(mockProfile);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" sx={{ ...gradientText, mb: 2 }}>
          Profile
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your gaming profile
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Info */}
        <Grid item xs={12} md={8}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar
                  src={profile.avatar}
                  sx={{ width: 100, height: 100, mr: 3 }}
                >
                  {profile.username.charAt(0)}
                </Avatar>
                <Box>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      label="Username"
                      value={profile.username}
                      sx={{ mb: 1 }}
                    />
                  ) : (
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {profile.username}
                    </Typography>
                  )}
                  <Typography variant="body1" color="text.secondary">
                    {profile.email}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(!isEditing)}
                sx={{ mb: 4 }}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ ...cardStyles, bgcolor: 'background.paper' }}>
                    <CardContent>
                      <Typography variant="h6" sx={gradientText}>
                        {profile.totalGold} G
                      </Typography>
                      <Typography color="text.secondary">
                        Total Gold Earned
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ ...cardStyles, bgcolor: 'background.paper' }}>
                    <CardContent>
                      <Typography variant="h6" sx={gradientText}>
                        {profile.gamesPlayed}
                      </Typography>
                      <Typography color="text.secondary">
                        Games Played
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ ...cardStyles, bgcolor: 'background.paper' }}>
                    <CardContent>
                      <Typography variant="h6" sx={gradientText}>
                        {profile.winRate}%
                      </Typography>
                      <Typography color="text.secondary">
                        Win Rate
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Settings */}
        <Grid item xs={12} md={4}>
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Account Settings
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              >
                Change Password
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}