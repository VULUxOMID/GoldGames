import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { gradientText, cardStyles } from '../theme/styles';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

export default function Sessions() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" sx={{ ...gradientText, mb: 2 }}>
          Gaming Sessions
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Join active gaming sessions or create your own
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Active Sessions */}
        <Grid item xs={12} md={8}>
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Active Sessions
              </Typography>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SportsEsportsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography color="text.secondary">
                  No active gaming sessions at the moment
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  startIcon={<SportsEsportsIcon />}
                >
                  Create Session
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Session Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Your Stats
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary" gutterBottom>
                  Total Sessions
                </Typography>
                <Typography variant="h4" sx={gradientText}>
                  0
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Gold Earned
                </Typography>
                <Typography variant="h4" sx={gradientText}>
                  0 G
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}