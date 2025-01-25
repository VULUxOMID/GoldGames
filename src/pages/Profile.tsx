import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Button, TextField, Alert, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
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

interface RootState {
  auth: {
    user: {
      id: string;
      email: string;
    } | null;
  };
}



export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // First try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        // If no profile exists, create one
        if (fetchError.code === 'PGRST116') {
          const defaultProfile = {
            id: user.id,
            username: user.email?.split('@')[0] || 'User',
            email: user.email,
            avatar: '',
            totalGold: 0,
            gamesPlayed: 0,
            winRate: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([defaultProfile])
            .select()
            .single();

          if (createError) {
            throw new Error('Failed to create profile: ' + createError.message);
          }

          setProfile(newProfile);
          return;
        }
        
        throw new Error('Failed to fetch profile: ' + fetchError.message);
      }

      setProfile(existingProfile);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
      setError(errorMessage);
      console.error('Profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile || !user) return;
    
    setUpdateLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          avatar: profile.avatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      setIsEditing(false);
      await fetchProfile(); // Refresh profile data after update
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
        <Alert severity="error">Failed to load profile</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
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
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar
                  src={profile.avatar}
                  sx={{ width: 100, height: 100, mr: 3 }}
                >
                  {profile.username.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      label="Username"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
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
                onClick={isEditing ? handleUpdateProfile : () => setIsEditing(true)}
                disabled={updateLoading}
                sx={{ mb: 4, width: { xs: '100%', sm: 'auto' } }}
              >
                {updateLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Profile')}
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