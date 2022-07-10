import Layout from 'components/layout/Layout';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './reset.css';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
      </Routes>
    </Router>
  );
}
