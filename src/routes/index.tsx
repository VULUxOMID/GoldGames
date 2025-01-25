import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

// Placeholder components for routes
const Home = () => <div>Home Page</div>;
const Wallet = () => <div>Wallet Page</div>;
const Sessions = () => <div>Gaming Sessions Page</div>;
const Leaderboard = () => <div>Leaderboard Page</div>;
const Social = () => <div>Social Page</div>;
const Profile = () => <div>Profile Page</div>;

export default function AppRoutes() {
  return (
    <Routes>
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