import React from 'react';
import { Link } from 'react-router-dom';
import WaterTreeScene from '../components/WaterTreeScene.tsx';

const WaterTree: React.FC = () => {
    return (
        <div className="relative w-full h-screen">
            <WaterTreeScene />
            <Link to="/" className="absolute top-4 left-4 bg-white px-4 py-2 rounded shadow">
                Back to Home
            </Link>
        </div>
    );
};

export default WaterTree;