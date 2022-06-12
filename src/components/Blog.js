import { useState } from "react";

const Blog = ({user, blog, incrementLikes, removeBlog}) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLikes = () => {
    incrementLikes(blog.id,
    {
      title: blog.title, 
      author: blog.author, 
      url: blog.url, 
      likes: blog.likes + 1
    });
  };

  const handleRemove = () => {
    if(window.confirm(`Are you sure you want to remove ${blog.title} by ${blog.author}?`)){
      removeBlog(blog.id);
    }
  };

  const blogDetails = () => {
    console.log(user);
    console.log(blog);
    return (
      <div>
        <p>URL : {blog.url}</p>
        <p>Likes : {blog.likes} <button onClick={handleLikes}>Like</button></p>
        {user.id === blog.user ? <button onClick={handleRemove}>Remove</button> : ""}
      </div>
    );
  };

  return (
    <div>
      {blog.title} {blog.author} <button onClick={toggleVisibility}>{visible ? "Hide" : "View"}</button>
      {visible ? blogDetails() : ""}
    </div> 
  ); 
};

export default Blog