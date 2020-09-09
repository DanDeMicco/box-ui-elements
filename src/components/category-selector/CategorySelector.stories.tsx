import * as React from 'react';

import CategorySelector from './CategorySelector';
import notes from './CategorySelector.stories.md';

const categories = [
    {
        id: 'legal',
        name: 'legal',
    },
    {
        id: 'marketing',
        name: 'marketing',
    },
    {
        id: 'hr',
        name: 'hr',
    },
    {
        id: 'bizops',
        name: 'bizops',
    },
    {
        id: 'sales',
        name: 'sales',
    },
    {
        id: 'finance',
        name: 'finance',
    },
];

export const NoOverflow = () => {
    const [category, setCategory] = React.useState('');
    return <CategorySelector categories={categories} onSelect={setCategory} currentCategory={category} />;
};

export const WithOverflowMenu = () => {
    const [category, setCategory] = React.useState('');
    return (
        <div style={{ width: '300px' }}>
            <CategorySelector categories={categories} onSelect={setCategory} currentCategory={category} />
        </div>
    );
};

export default {
    title: 'Components|CategorySelector',
    component: CategorySelector,
    parameters: {
        notes,
    },
};
