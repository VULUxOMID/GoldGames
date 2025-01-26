import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { signUp, clearError } from '../../store/slices/authSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Paper,
} from '@mui/material';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error: authError } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (authError) dispatch(clearError());
    if (passwordError) setPasswordError(null);
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setPasswordError('Please fill in all required fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setPasswordError('Please enter a valid email address');
      return;
    }
    
    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      setPasswordError(null);
      await dispatch(signUp({
        email: formData.email,
        password: formData.password
      })).unwrap();
      setSignupSuccess(true);
    } catch (err: unknown) {
      if (typeof err === 'string') {
        if (err.toLowerCase().includes('email already registered')) {
          setPasswordError('This email is already registered. Please sign in or use a different email.');
        } else {
          setPasswordError(err);
        }
      } else if (err instanceof Error) {
        setPasswordError(err.message);
      } else {
        setPasswordError('An unexpected error occurred during sign up');
      }
      console.error('Sign up error:', err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign Up
          </Typography>
          {signupSuccess ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Registration successful! Please check your email to confirm your account before signing in.
            </Alert>
          ) : (authError || passwordError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authError || passwordError}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/signin')}
              disabled={loading}
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;