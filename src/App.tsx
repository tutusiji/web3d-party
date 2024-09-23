import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home.tsx';
import WaterTree from './pages/WaterTree.tsx';

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-md">
                    <div className="container mx-auto px-6 py-3">
                        <Link to="/" className="text-xl font-semibold text-gray-800">
                            React 3D Scenes
                        </Link>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/demos/water-tree" element={<WaterTree />} />
                    {/* <Route path="/demos/city" element={<City />} /> */}
                    {/* <Route path="/demos/space" element={<Space />} /> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;