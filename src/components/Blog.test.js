import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const blog = {
    title: "Testing",
    author: "Tester",
    url: "Test",
    likes: 1
};

const user = {
    id: "123"
};

test('renders blog initial state', () => {
    const {container} = render(<Blog blog={blog} />);

    let element = container.querySelector('.blog-info');
    expect(element).toBeDefined();
    element = container.querySelector('.blog-details');
    expect(element).toBeNull();
});

test('blog details are shown when button clicked', async () => {
    const showDetails = jest.fn();

    render(<Blog blog={blog} user={user}/>);
    
    const trigger = userEvent.setup();
    const button = screen.getByText('View');
    button.onclick = showDetails;
    await trigger.click(button);

    expect(showDetails.mock.calls).toHaveLength(1);
});

test('like handler is called twice on two button presses', async () => {
    const incrementLikes = jest.fn();

    render(<Blog blog={blog} user={user} incrementLikes={incrementLikes}/>);

    const trigger = userEvent.setup();
    let button = screen.getByText('View');
    await trigger.click(button);

    button = screen.getByText('Like');
    button.onClick = incrementLikes;
    await trigger.click(button);
    await trigger.click(button);

    expect(incrementLikes.mock.calls).toHaveLength(2);
});