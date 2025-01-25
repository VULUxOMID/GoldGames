import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Button } from '@mui/material';
import { gradientText, cardStyles } from '../theme/styles';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface Friend {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline';
  lastActive: string;
}

const mockFriends: Friend[] = [
  { id: '1', username: 'GoldMaster', avatar: '', status: 'online', lastActive: 'Now' },
  { id: '2', username: 'ProGamer123', avatar: '', status: 'offline', lastActive: '2 hours ago' },
  { id: '3', username: 'GameWizard', avatar: '', status: 'online', lastActive: 'Now' },
];

export default function Social() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" sx={{ ...gradientText, mb: 2 }}>
          Social Hub
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Connect with fellow gamers
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Friends List */}
        <Grid item xs={12} md={8}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <GroupIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5">
                  Friends
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                {mockFriends.map((friend) => (
                  <Grid item xs={12} sm={6} key={friend.id}>
                    <Card sx={{ ...cardStyles, bgcolor: 'background.paper' }}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={friend.avatar} sx={{ width: 56, height: 56, mr: 2 }}>
                          {friend.username.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{friend.username}</Typography>
                          <Typography 
                            variant="body2" 
                            color={friend.status === 'online' ? 'success.main' : 'text.secondary'}
                          >
                            {friend.status === 'online' ? 'Online' : `Last seen ${friend.lastActive}`}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Friend Requests */}
        <Grid item xs={12} md={4}>
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Add Friends
              </Typography>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PersonAddIcon />}
                sx={{ mb: 2 }}
              >
                Find New Friends
              </Button>
              <Typography variant="body2" color="text.secondary" align="center">
                Connect with other players to join their gaming sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}