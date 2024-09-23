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

const DemoList: React.FC = () => {
    return (
        <div>
            <h1>Web3D Demo List</h1>
            <ul>
                {demos.map((demo) => (
                    <li key={demo.id}>
                        <Link to={demo.path}>{demo.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DemoList;