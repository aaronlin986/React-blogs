import {useState} from 'react';

const BlogForm = ({addBlog}) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const handleAddBlog = (e) => {
        e.preventDefault();
        addBlog({title, author, url});
        setTitle("");
        setAuthor("");
        setUrl("");
    };

    return (
        <form onSubmit={handleAddBlog}>
          Title: <input
            type="text"
            value={title}
            onChange={({target}) => setTitle(target.value)}
          />
          Author: <input
            type="text"
            value={author}
            onChange={({target}) => setAuthor(target.value)}
          />
          URL: <input
            type="text"
            value={url}
            onChange={({target}) => setUrl(target.value)}
          />
          <button>Submit</button>
        </form>
    );
};

export default BlogForm;