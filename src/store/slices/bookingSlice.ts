import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

interface Session {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  max_players: number;
  current_players: number;
  status: 'open' | 'full' | 'in_progress' | 'completed';
  created_at: string;
}

interface BookingState {
  sessions: Session[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  sessions: [],
  loading: false,
  error: null,
};

export const fetchSessions = createAsyncThunk(
  'booking/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('gaming_sessions')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An error occurred while fetching sessions');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default bookingSlice.reducer;