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
              
              <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Player</TableCell>
                      <TableCell align="right">Gold Earned</TableCell>
                      <TableCell align="right">Games Won</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockLeaderboard.map((entry) => (
                      <TableRow key={entry.rank}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {entry.rank === 1 && <EmojiEventsIcon sx={{ color: '#FFD700', mr: 1 }} />}
                            {entry.rank === 2 && <EmojiEventsIcon sx={{ color: '#C0C0C0', mr: 1 }} />}
                            {entry.rank === 3 && <EmojiEventsIcon sx={{ color: '#CD7F32', mr: 1 }} />}
                            {entry.rank}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={entry.avatar} sx={{ mr: 2 }}>
                              {entry.username.charAt(0)}
                            </Avatar>
                            {entry.username}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{entry.goldEarned} G</TableCell>
                        <TableCell align="right">{entry.gamesWon}</TableCell>
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