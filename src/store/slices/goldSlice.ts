import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

interface Transaction {
  id?: string;
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
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch transactions');
    }
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
  }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          amount,
          type,
          description,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as Transaction;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create transaction');
    }
  }
);

const goldSlice = createSlice({
  name: 'gold',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
        state.balance = action.payload.reduce((total, tx) => {
          return total + (tx.type === 'credit' ? tx.amount : -tx.amount);
        }, 0);
      })
      .addCase(getTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch transaction history';
      })
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
        state.balance += action.payload.type === 'credit' ? action.payload.amount : -action.payload.amount;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create transaction';
      });
  },
});

export default goldSlice.reducer;