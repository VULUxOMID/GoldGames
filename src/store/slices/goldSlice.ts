import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../lib/supabase';

interface Transaction {
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

interface GoldState {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: GoldState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
};

export const getTransactionHistory = createAsyncThunk(
  'gold/getTransactionHistory',
  async (userId: string) => {
    const { data, error } = await db.transactions.getHistory(userId);
    if (error) throw error;
    return data as Transaction[];
  }
);

export const createTransaction = createAsyncThunk(
  'gold/createTransaction',
  async ({
    userId,
    amount,
    type,
    description,
  }: {
    userId: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
  }) => {
    const { data, error } = await db.transactions.create({
      user_id: userId,
      amount,
      type,
      description,
      created_at: new Date().toISOString(),
    });
    if (error) throw error;
    if (!data) throw new Error('Failed to create transaction');
    return data as Transaction;
  }
);

const goldSlice = createSlice({
  name: 'gold',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Transaction History
      .addCase(getTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
        // Calculate balance from transactions
        state.balance = action.payload.reduce((acc: number, curr: Transaction) => {
          return curr.type === 'credit'
            ? acc + curr.amount
            : acc - curr.amount;
        }, 0);
      })
      .addCase(getTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transaction history';
      })
      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = [action.payload, ...state.transactions];
        // Update balance based on transaction type
        state.balance += action.payload.type === 'credit'
          ? action.payload.amount
          : -action.payload.amount;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create transaction';
      });
  },
});

export const { clearError, updateBalance } = goldSlice.actions;
export default goldSlice.reducer;