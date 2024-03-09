import Blogs from "./Blogs";
import Home from "./Home";
import Navbar from "./Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./NoPage";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import CreatePost from "./CreatePost";
import OwnBlogs from "./OwnBlogs";
import BlogTemplate from "./BlogTemplate";
import EditPost from "./EditPost";
import Profile from "./Profile";

function App() {

  var isSignedIn;
  if(JSON.parse(localStorage.getItem('isSignedIn'))){
      isSignedIn = JSON.parse(localStorage.getItem('isSignedIn'));
  } else{
      isSignedIn = false;
  }

 

  return (

      <BrowserRouter>

        <Navbar />
        <Routes>

          <Route>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/blogtemplate/Published" element={<BlogTemplate isPublic={'Published'} />} />
              <Route path="*" element={<NoPage />} />
              
              {/* THESE PAGES ARE ONLY VISIBLE IS USER IS SIGNED IN */}
              {(isSignedIn) ? <Route path="/profile" element={<Profile />} /> : null}
              {(isSignedIn) ? <Route path="/editpost" element={<EditPost />} /> : null}
              {(isSignedIn) ? <Route path="/ownblogs" element={<OwnBlogs />} /> : null}
              {(isSignedIn) ? <Route path="/blogtemplate/NotPublished" element={<BlogTemplate isPublic={'NotPublished'}/>} />: null}
              {(isSignedIn) ? <Route path="/createpost" element = {<CreatePost />} /> : null}
          </Route>

        </Routes>

      </BrowserRouter>
      );
}

export default App;
 