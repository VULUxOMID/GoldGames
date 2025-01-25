import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Wallet from '../pages/Wallet';
import Sessions from '../pages/Sessions';
import Leaderboard from '../pages/Leaderboard';
import Social from '../pages/Social';
import Profile from '../pages/Profile';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/social" element={<Social />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}