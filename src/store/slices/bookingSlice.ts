import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../lib/supabase';

interface BookingState {
  sessions: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  sessions: [],
  loading: false,
  error: null,
};

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async ({
    userId,
    setupId,
    startTime,
    duration,
  }: {
    userId: string;
    setupId: string;
    startTime: string;
    duration: number;
  }) => {
    const { data, error } = await db.sessions.create({
      user_id: userId,
      setup_id: setupId,
      start_time: startTime,
      duration,
      status: 'scheduled',
      created_at: new Date().toISOString(),
    });
    if (error) throw error;
    return data;
  }
);

export const getUserSessions = createAsyncThunk(
  'booking/getUserSessions',
  async (userId: string) => {
    const { data, error } = await db.sessions.get(userId);
    if (error) throw error;
    return data;
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = [action.payload, ...state.sessions];
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create booking';
      })
      // Get User Sessions
      .addCase(getUserSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(getUserSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user sessions';
      });
  },
});

export const { clearError } = bookingSlice.actions;
export default bookingSlice.reducer;