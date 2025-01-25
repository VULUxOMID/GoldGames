import { useSelector } from 'react-redux';
import { Box, Container, Typography, Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { gradientText, cardStyles, shimmerEffect } from '../theme/styles';

interface RootState {
  gold: {
    balance: number;
    transactions: Array<{
      amount: number;
      type: 'credit' | 'debit';
      description: string;
      created_at: string;
    }>;
  };
}

export default function Wallet() {
  const { balance, transactions } = useSelector((state: RootState) => state.gold);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" sx={{ ...gradientText, mb: 2 }}>
          Gold Wallet
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your gaming rewards
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ ...cardStyles, height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Current Balance
              </Typography>
              <Typography 
                variant="h2" 
                sx={{ 
                  ...gradientText,
                  ...shimmerEffect,
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                {balance} G
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Transaction History
              </Typography>
              <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell align="right">
                          {transaction.amount} G
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={transaction.type}
                            color={transaction.type === 'credit' ? 'success' : 'error'}
                            size="small"
                            sx={{
                              textTransform: 'capitalize',
                              minWidth: 80
                            }}
                          />
                        </TableCell>
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