import { Box, Container, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import { gradientText, cardStyles } from '../theme/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  goldEarned: number;
  gamesWon: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'GoldMaster', avatar: '', goldEarned: 15000, gamesWon: 42 },
  { rank: 2, username: 'ProGamer123', avatar: '', goldEarned: 12500, gamesWon: 38 },
  { rank: 3, username: 'GameWizard', avatar: '', goldEarned: 10000, gamesWon: 35 },
];

export default function Leaderboard() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" sx={{ ...gradientText, mb: 2 }}>
          Leaderboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Top performers in the GoldGames community
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Top Players */}
        <Grid item xs={12}>
          <Card sx={cardStyles}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <EmojiEventsIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5">
                  Top Players
                </Typography>
              </Box>
              
              <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', maxWidth: '100%', overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ whiteSpace: 'nowrap', padding: { xs: 1, sm: 2 } }}>Rank</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', padding: { xs: 1, sm: 2 } }}>Player</TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap', padding: { xs: 1, sm: 2 } }}>Gold</TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap', padding: { xs: 1, sm: 2 } }}>Won</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockLeaderboard.map((entry) => (
                      <TableRow key={entry.rank}>
                        <TableCell sx={{ padding: { xs: 1, sm: 2 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {entry.rank === 1 && <EmojiEventsIcon sx={{ color: '#FFD700', mr: 1, fontSize: { xs: 16, sm: 24 } }} />}
                            {entry.rank === 2 && <EmojiEventsIcon sx={{ color: '#C0C0C0', mr: 1, fontSize: { xs: 16, sm: 24 } }} />}
                            {entry.rank === 3 && <EmojiEventsIcon sx={{ color: '#CD7F32', mr: 1, fontSize: { xs: 16, sm: 24 } }} />}
                            {entry.rank}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ padding: { xs: 1, sm: 2 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={entry.avatar} sx={{ mr: 1, width: { xs: 24, sm: 32 }, height: { xs: 24, sm: 32 } }}>
                              {entry.username.charAt(0)}
                            </Avatar>
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              {entry.username}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ padding: { xs: 1, sm: 2 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>{entry.goldEarned} G</TableCell>
                        <TableCell align="right" sx={{ padding: { xs: 1, sm: 2 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>{entry.gamesWon}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}