import React from 'react';
import { Link } from 'react-router-dom';

interface Demo {
    id: string;
    name: string;
    path: string;
}

const demos: Demo[] = [
    { id: 'water-tree', name: 'Water Tree Scene', path: '/demos/water-tree' },
    { id: 'city', name: 'City Scene', path: '/demos/city' },
    { id: 'space', name: 'Space Scene', path: '/demos/space' },
    // 在这里添加更多的demo
];

const Home: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6">Welcome to React 3D Scenes</h1>
            <p className="text-xl mb-8">Explore our collection of Web3D demos.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demos.map((demo) => (
                    <Link
                        key={demo.id}
                        to={demo.path}
                        className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
                    >
                        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{demo.name}</h2>
                        <p className="font-normal text-gray-700">Click to view the {demo.name} demo.</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;