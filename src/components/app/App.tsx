import Hello from 'components/hello/Hello';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './reset.css';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
