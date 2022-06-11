import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);

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
      setMessage("Invalid username or password.");
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

  const handleAddBlog = async (event) => {
    event.preventDefault();
    try{
      const newBlog = {
        title, author, url
      };
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setTitle("");
      setAuthor("");
      setUrl("");
      setMessage("Successfully added new blog");
      setStatus("success");
      setTimeout(() => {
        setMessage(null);
        setStatus(null);
      }, 5000);
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
      <form onSubmit={handleLogin}>
        <div>
          Username <input
            type="text"
            value={username}
            name="Username"
            onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          Password <input
            type="password"
            value={password}
            name="Password"
            onChange={({target}) => setPassword(target.value)}
          />
        </div>
        <button>Login</button>
      </form>
    );
  };

  const blogsForm = () => {
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

  const blogsList = () => {
    return (blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    ))
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
