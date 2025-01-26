import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Button, TextField, Alert, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import { gradientText, cardStyles } from '../theme/styles';
import EditIcon from '@mui/icons-material/Edit';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  total_gold: number;
  games_played: number;
  win_rate: number;
  created_at: string;
  updated_at: string;
}

interface SupabaseError {
  code: string;
  message: string;
  details?: string;
}

interface RootState {
  auth: {
    user: {
      id: string;
      email: string;
    } | null;
  };
}

interface UpdateProfileData {
  username: string;
  avatar: string | null;
  updated_at: string;
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
    } else {
      setLoading(false);
      setProfile(null);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // Profile doesn't exist, create a new one
          await createNewProfile(user);
          return;
        }
        throw new Error(`Profile fetch failed: ${fetchError.message}`);
      }

      if (!existingProfile) {
        throw new Error('Profile not found in database');
      }

      // Validate the profile data structure
      if (typeof existingProfile.id !== 'string') {
        throw new Error('Invalid profile ID format');
      }

      setProfile(existingProfile);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewProfile = async (user: RootState['auth']['user']) => {
    if (!user || !user.id || !user.email) {
      setError('Invalid user data');
      setLoading(false);
      return;
    }
  
    const defaultProfile: UserProfile = {
      id: user.id, // Ensure this is a valid UUID from auth
      username: user.email.split('@')[0] || 'User',
      email: user.email,
      avatar: null,
      total_gold: 0,
      games_played: 0,
      win_rate: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  
    try {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([defaultProfile])
        .select()
        .single();
  
      if (createError) {
        if (createError.code === '23505') { // Unique violation error
          const { data: retryProfile, error: retryError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
  
          if (retryError) {
            throw new Error(`Failed to fetch profile: ${retryError.message}`);
          }
          if (!retryProfile) {
            throw new Error('Profile not found after creation attempt');
          }
          setProfile(retryProfile as UserProfile);
          return;
        }
        throw new Error(`Profile creation failed: ${createError.message}`);
      }
  
      if (!newProfile) {
        throw new Error('Failed to create new profile: No data returned');
      }

      // Validate the new profile
      if (typeof newProfile.id !== 'string') {
        throw new Error('Invalid profile ID format in created profile');
      }
      
      setProfile(newProfile as UserProfile);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create profile';
      setError(errorMessage);
      console.error('Profile creation error:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile || !user) {
      setError('Profile or user data is missing');
      return;
    }
    
    if (!profile.username.trim()) {
      setError('Username cannot be empty');
      return;
    }

    setUpdateLoading(true);
    setError(null); // Clear any existing errors

    try {
      // First check if the profile still exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('updated_at')
        .eq('id', user.id)
        .single();

      if (checkError) throw new Error('Failed to verify profile status');
      if (!existingProfile) throw new Error('Profile no longer exists');

      const updateData: UpdateProfileData = {
        username: profile.username.trim(),
        avatar: profile.avatar,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .eq('updated_at', existingProfile.updated_at); // Optimistic locking

      if (updateError) {
        if (updateError.code === 'PGRST116') {
          throw new Error('Profile was modified by another session. Please refresh and try again.');
        }
        throw updateError;
      }

      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Profile update error:', error);
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
                      error={!profile.username.trim()}
                      helperText={!profile.username.trim() ? 'Username is required' : ''}
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
                disabled={updateLoading || (isEditing && !profile.username.trim())}
                sx={{ mb: 4, width: { xs: '100%', sm: 'auto' } }}
              >
                {updateLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Profile')}
              </Button>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ ...cardStyles, bgcolor: 'background.paper' }}>
                    <CardContent>
                      <Typography variant="h6" sx={gradientText}>
                        {profile.total_gold} G
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
                        {profile.games_played}
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
                        {profile.win_rate}%
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