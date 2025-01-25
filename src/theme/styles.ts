import { keyframes } from '@mui/material/styles';

// Animation keyframes
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Common styles
export const cardStyles = {
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(255, 215, 0, 0.15)'
  },
  animation: `${fadeIn} 0.5s ease-out`
};

export const gradientText = {
  background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

export const glowEffect = {
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 'inherit',
    background: 'linear-gradient(45deg, rgba(255,215,0,0.2), rgba(255,165,0,0.2))',
    filter: 'blur(8px)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    zIndex: -1
  },
  '&:hover::after': {
    opacity: 1
  }
};

export const shimmerEffect = {
  background: 'linear-gradient(90deg, rgba(255,215,0,0.1) 25%, rgba(255,215,0,0.2) 50%, rgba(255,215,0,0.1) 75%)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 2s infinite linear`
};