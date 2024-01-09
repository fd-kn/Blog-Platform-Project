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
import EditPost from "./EditPost";
import Profile from "./Profile";
import skytreesun from "./skytreesun.jpg"

function App() {

  var isSignedIn;
  if(JSON.parse(localStorage.getItem('isSignedIn'))){
      isSignedIn = JSON.parse(localStorage.getItem('isSignedIn'));
  } else{
      isSignedIn = false;
  }

  return (
    // <div className="bg-gradient-to-br from-purple-400 via-red-200 to-blue-300">
    <div className="bg-blue-200">

    <BrowserRouter>
    <div className=" ">
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
          {(isSignedIn) ? <Route path="/profile" element={<Profile />} /> : null}
          {(isSignedIn) ? <Route path="/editpost" element={<EditPost />} /> : null}
          {(isSignedIn) ? <Route path="/ownblogs" element={<OwnBlogs />} /> : null}
          <Route path="/blogtemplate/Published" element={<BlogTemplate isPublic={'Published'} />} />
          {(isSignedIn) ? <Route path="/blogtemplate/NotPublished" element={<BlogTemplate isPublic={'NotPublished'}/>} />: null}


          <Route path="*" element={<NoPage />} />
          {(isSignedIn) ? <Route path="/createpost" element = {<CreatePost />} /> : null}
        </Route>
      </Routes>
      </div>
    </BrowserRouter>
    
    </div>
  );
}

export default App;
 