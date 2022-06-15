import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('creating a new blog', async () => {
    const createBlog = jest.fn();

    render(<BlogForm addBlog={createBlog}/>);

    const trigger = userEvent.setup();
    const createButton = screen.getByText("Submit");

    let inputs = screen.getAllByRole('textbox');
    await trigger.type(inputs[0], "Test Title");
    await trigger.type(inputs[1], "Test Author");
    await trigger.type(inputs[2], "Test URL");
    await trigger.click(createButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe("Test Title");
    expect(createBlog.mock.calls[0][0].author).toBe("Test Author");
    expect(createBlog.mock.calls[0][0].url).toBe("Test URL");
});