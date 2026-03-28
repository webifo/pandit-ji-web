import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/axios';

// Types
export interface User {
  _id: string;
  id?: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: string[];
  status: string;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthResponse {
  token: string;
  user: User;
  expiresIn: string;
}

interface RegisterResponse {
  user: User;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async Thunks

// Register
export const register = createAsyncThunk<
  RegisterResponse,
  { name: string; email: string; password: string; phone?: string },
  { rejectValue: string }
>(
  'auth/register',
  async ({ name, email, password, phone }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: RegisterResponse;
      }>('/api/public/register', {
        name,
        email,
        password,
        phone,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Registration failed');
    }
  }
);

// Login
export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: AuthResponse;
      }>('/api/public/login', {
        email,
        password,
      });

      const { token, user, expiresIn } = response.data.data;

      // Store in localStorage
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user, expiresIn };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Login failed');
    }
  }
);

// Logout
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.clear();
    } catch (error: any) {
      return rejectWithValue('Logout failed');
    }
  }
);

// Get current user (me)
export const getMe = createAsyncThunk<
  { user: User },
  void,
  { rejectValue: string }
>(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: { user: User };
      }>('/api/private/me');

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// Update current user (me)
export const updateMe = createAsyncThunk<
  { user: User },
  { name?: string; phone?: string; avatar?: string },
  { rejectValue: string }
>(
  'auth/updateMe',
  async ({ name, phone, avatar }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<{
        success: boolean;
        message: string;
        data: { user: User };
      }>('/api/private/me', {
        name,
        phone,
        avatar,
      });

      const { user } = response.data.data;

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(user));

      return { user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Delete current user (me)
export const deleteMe = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/deleteMe',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.delete('/api/private/me');
      localStorage.clear();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to delete account');
    }
  }
);

// Load user from localStorage on app start
export const loadUserFromStorage = createAsyncThunk<
  { user: User; accessToken: string },
  void,
  { rejectValue: string }
>(
  'auth/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');

      if (!accessToken || !userStr) {
        return rejectWithValue('No stored authentication data');
      }

      const user = JSON.parse(userStr);
      return { user, accessToken };
    } catch (error: any) {
      return rejectWithValue('Failed to load user from storage');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });

    // Get Me
    builder
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch profile';
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });

    // Update Me
    builder
      .addCase(updateMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMe.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
      });

    // Delete Me
    builder
      .addCase(deleteMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMe.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(deleteMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete account';
      });

    // Load User from Storage
    builder
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;