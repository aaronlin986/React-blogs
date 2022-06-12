import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("currentUser");
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token); 
    }
  }, []);

  const handleLogin = async event => {
    event.preventDefault();
    try{
      const user = await loginService.login({username, password});
      window.localStorage.setItem("currentUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setMessage("Successfully logged in");
      setStatus("success");
      setTimeout(() => {
        setMessage(null);
        setStatus(null);
      }, 5000);
    }
    catch(exception){
      setMessage("Invalid username or password");
      setStatus("error");
      setTimeout(() => {
        setMessage(null);
        setStatus(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("currentUser");
    setUser(null);
    setMessage("Successfully logged out");
    setStatus("success");
    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 5000);
  }

  const incrementLikes = async (id, blogObject) => {
    const returnedBlog = await blogService.update(id, blogObject);
    setBlogs(blogs.map(b => b.id === returnedBlog.id ? returnedBlog : b));
  };

  const addBlog = async (blogObject) => {
    try{
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      setMessage("Successfully added new blog");
      setStatus("success");
      setTimeout(() => {
        setMessage(null);
        setStatus(null);
      }, 5000);
      blogFormRef.current.toggleVisibility();
    }
    catch(exception){
      setMessage(exception.error);
      setStatus("error");
      setTimeout(() => {
        setMessage(null);
        setStatus(null);
      }, 5000);
    }
  };

  const loginForm = () => {
    return (
      <Togglable buttonLabel="Login">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({target}) => setUsername(target.value)}
          handlePasswordChange={({target}) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    );
  };

  const blogsForm = () => {
    return (
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog}/>
      </Togglable>
    );
  };

  const removeBlog = async (id) => {
    await blogService.del(id);
    setBlogs(blogs.filter(b => b.id !== id));
  };

  const sortingFunction = (a, b) => {
    if(a.likes < b.likes){
      return 1;
    }
    else if(a.likes > b.likes){
      return -1;
    }
    return 0;
  };

  const blogsList = () => {
    return (
      blogs
        .sort(sortingFunction)
        .map(blog =>
          <Blog key={blog.id} user={user} blog={blog} incrementLikes={incrementLikes} removeBlog={removeBlog}/>
        )
    );
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} status={status}/>
      {
        user === null
        ? loginForm()
        : <div>
            <p>{user.name} logged in. <button onClick={handleLogout}>Log out</button></p>
            <h2>Create New</h2>
            {blogsForm()}
            {blogsList()}
          </div>
      }
    </div>
  )
}

export default App
