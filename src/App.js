import Blogs from "./Blogs";
import Home from "./Home";
import Navbar from "./Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./NoPage";
// import Stories from "./Stories";
// import Settings from "./Settings";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import CreatePost from "./CreatePost";
import OwnBlogs from "./OwnBlogs";
import BlogTemplate from "./BlogTemplate";


function App() {

  var isSignedIn;
  if(JSON.parse(localStorage.getItem('isSignedIn'))){
      isSignedIn = JSON.parse(localStorage.getItem('isSignedIn'));
  } else{
      isSignedIn = false;
  }

  return (
    <div className="bg-sky-300 h-screen ">
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          {/* <Route path="/stories" element={<Stories />} /> */}
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/ownblogs" element={<OwnBlogs />} />
          <Route path="/blogtemplate/Published" element={<BlogTemplate isPublic={'Published'} />} />
          <Route path="/blogtemplate/NotPublished" element={<BlogTemplate isPublic={'NotPublished'}/>} />


          <Route path="*" element={<NoPage />} />
          {(isSignedIn) ? <Route path="/createpost" element = {<CreatePost />} /> : null}
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
 