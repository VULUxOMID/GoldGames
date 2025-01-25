import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactionHistory } from '../store/slices/goldSlice';
import { useAppSelector } from '../store/store';
import { Box, Container, Typography, Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert } from '@mui/material';
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
    loading: boolean;
    error: string | null;
  };
  auth: {
    user: {
      id: string;
      email: string;
    } | null;
  };
}

export default function Wallet() {
  const dispatch = useDispatch();
  const { balance, transactions, loading, error } = useSelector((state: RootState) => state.gold);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(getTransactionHistory(user.id));
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        <Typography 
          variant="h2" 
          sx={{ 
            ...gradientText, 
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Gold Wallet
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
        >
          Manage your gaming rewards
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ ...cardStyles, height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3, md: 4 } }}>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
              >
                Current Balance
              </Typography>
              <Typography 
                variant="h2" 
                sx={{ 
                  ...gradientText,
                  ...shimmerEffect,
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
                }}
              >
                {balance} G
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={cardStyles}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
                }}
              >
                Transaction History
              </Typography>
              {transactions.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No transactions yet
                </Typography>
              ) : (
                <TableContainer 
                component={Paper} 
                sx={{ 
                  bgcolor: 'background.paper',
                  overflowX: 'auto'
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ whiteSpace: 'nowrap', padding: { xs: 1, sm: 2 } }}>Date</TableCell>
                      <TableCell sx={{ padding: { xs: 1, sm: 2 } }}>Description</TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap', padding: { xs: 1, sm: 2 } }}>Amount</TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap', padding: { xs: 1, sm: 2 } }}>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ whiteSpace: 'nowrap', padding: { xs: 1, sm: 2 } }}>
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ maxWidth: { xs: '120px', sm: '200px', md: '300px' }, overflow: 'hidden', textOverflow: 'ellipsis', padding: { xs: 1, sm: 2 } }}>
                          {transaction.description}
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap', padding: { xs: 1, sm: 2 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          {transaction.amount} G
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap', padding: { xs: 1, sm: 2 } }}>
                          <Chip
                            label={transaction.type}
                            color={transaction.type === 'credit' ? 'success' : 'error'}
                            size="small"
                            sx={{
                              textTransform: 'capitalize',
                              minWidth: { xs: 60, sm: 80 },
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                            />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}