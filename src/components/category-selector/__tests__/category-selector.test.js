import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategorySelector from '..';

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

const props = {
    onSelect: jest.fn(),
    categories,
    currentCategory: '',
};

describe('CategorySelector', () => {
    afterEach(() => {
        props.onSelect.mockReset();
    });

    it('should trigger click handler when it gets key presses', async () => {
        render(<CategorySelector {...props} />);

        const category = 'hr';
        const pill = await screen.findByTestId(`template-category-${category}`);
        fireEvent.keyPress(pill, { key: 'Enter', charCode: 13 });
        fireEvent.keyPress(pill, { key: ' ', charCode: 32 });
        expect(props.onSelect).toHaveBeenCalledWith(category);
    });

    it('should trigger click handler when clicked', async () => {
        render(<CategorySelector {...props} />);

        const category = 'hr';
        const pill = await screen.findByTestId(`template-category-${category}`);
        fireEvent.click(pill);
        expect(props.onSelect).toHaveBeenCalledWith(category);
    });
});

describe('CategorySelector - defaults', () => {
    it('should handle setting default values for props', () => {
        const container = render(<CategorySelector {...props} />);

        const category = container.findByTestId('template-category-all');
        expect(category).toBeTruthy();
    });
});
