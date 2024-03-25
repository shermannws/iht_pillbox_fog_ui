import './App.css';
import OverviewPage from "./pages/OverviewPage"
import Chart from "./pages/Chart"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route exact path="/" element={<OverviewPage/>} />
            <Route path="/records/:patientId" element={<Chart/>} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
