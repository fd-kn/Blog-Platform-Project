import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebaseconfig";
import { Link } from "react-router-dom";
import backArrow from "./Images/backArrow.jpg";


const OwnBlogs = () => {


    const [allblogs, setAllblogs] = useState([]);
    const [isDraft, setIsDraft] = useState(true);
    const [draftBlogs, setDraftBlogs] = useState([]);
    const [publishedBlogs, setPublishedBlogs] = useState([])

  // CHECKS IF USER IS VIEWING THEIR DRAFTS SECTION OR PUBLISHED SECTION OF THEIR BLOGS

    useEffect(() => {
      const draftStorage = JSON.parse(localStorage.getItem('draftStorage'));
      if (draftStorage !== null) {
        setIsDraft(draftStorage);
      } 
    }, []);

    var userID;
    if(JSON.parse(localStorage.getItem('userID'))){
        userID = JSON.parse(localStorage.getItem('userID'));
    } else{
        userID = '';
    }


    useEffect(() => {
        if(userID !== ''){
        const fetchData = async () => {
          try {
            const queryRef = query(collection(db, 'allBlogs'), where('id', "==", userID));
            getDocs(queryRef)
            .then((querySnapshot) => {
                const newBlogs = [];
                querySnapshot.forEach((doc) => {
                    const blogDetails = {
                        title: doc.data().title,
                        post: doc.data().post,
                        author: doc.data().userName,
                        date: doc.data().dateAdded,
                        time: doc.data().timeAdded,
                        blogID: doc.data().blogID,
                        datePublished: doc.data().datePublished,
                        timePublished: doc.data().timePublished,
                        isPublished: doc.data().isPublished,
                        edited: doc.data().edited,
                        blogImage: doc.data().blogImage
                    }
                    newBlogs.push(blogDetails);
                    });



                    newBlogs.sort((a, b) => {
  
                      const [dayA, monthA, yearA] = a.date.split('/');
                      const [hourA, minuteA, secondA] = a.time.split(':');
                    
                      const [dayB, monthB, yearB] = b.date.split('/');
                      const [hourB, minuteB, secondB] = b.time.split(':');

                    
                      const dateTimeA = new Date(yearA, monthA - 1, dayA, hourA, minuteA, secondA);
                      const dateTimeB = new Date(yearB, monthB - 1, dayB, hourB, minuteB, secondB);

                      return dateTimeB - dateTimeA;
                    });
            
                      setAllblogs(newBlogs);
                      setDraftBlogs(newBlogs.filter(blog => blog.isPublished === false));
                      setPublishedBlogs(newBlogs.filter(blog => blog.isPublished === true));

            })

          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();}
      });


      const handlePostClick = (blogID) => {
        localStorage.setItem('blogID', JSON.stringify(blogID));
      }

      // SEPERATES THE BLOGS IN TWO SECTIONS - ONE FOR DRAFTS AND ONE FOR PUBLISHED BLOGS

      const handleSplit = (draft) => {
        if(draft === 'Draft'){
          setIsDraft(true);
          localStorage.setItem('draftStorage', JSON.stringify(true));

          setDraftBlogs(allblogs.filter(blog => blog.isPublished === false));
        } else if(draft === 'Published'){
          setIsDraft(false);
          localStorage.setItem('draftStorage', JSON.stringify(false));
          setPublishedBlogs(allblogs.filter(blog => blog.isPublished === true));
        }
      }

      const blogsToMap = isDraft ? draftBlogs : publishedBlogs;


    return ( 

        <div className="min-h-screen p-5">

          <div className="flex justify-between pt-10 ">
              <button className="py-2 px-5 m-2 text-l rounded-xl bg-blue-200 hover:bg-blue-400
              hover:scale-110 duration-300"><Link to='/blogs'><img className="h-6 w-6" src={backArrow} alt="back" /></Link>
              </button>
              <h1 className="text-4xl -translate-x-10 flex-grow text-center italic">My Blogs</h1>
          </div>

          <div className="flex justify-start m-5 text-xl italic"> 
            <button className={`p-2 m-2 hover:scale-110 duration-300 ${isDraft && 'underline'}`} onClick={() => handleSplit('Draft')} >Drafts</button>
            <button className={`p-2 m-2 hover:scale-110 duration-300 ${!isDraft && 'underline'}`} onClick={() => handleSplit('Published')}>Published</button>
          </div>


              <div className="flex flex-wrap justify-start m-5">
                  {blogsToMap.length === 0 ? <p>There are currently no blogs!</p> : null}
                  {blogsToMap.map((blog, index) => (
                      <div key={index} onClick={()=>handlePostClick(blog.blogID)} 
                      className=" w-5/6 sm:w-8/12 md:w-5/12 lg:w-4/12 xl:w-3/12 m-5 shadow-md shadow-gray-200 rounded-lg 
                      hover:scale-110 duration-300">
                          <Link to={`/blogtemplate/${'NotPublished'}`}>
                              <img className="w-full h-48 rounded-t-lg mb-6" src={blog.blogImage} alt="nooo" />
                              <h1 className="text-4xl  pb-12 p-2 break-words text-center">{blog.title}</h1>
                              <div className="pl-2 pb-2 text-xs break-words">
                                <p>Written by: <b>{blog.author}</b></p>
                                {isDraft ? <p>Date Added: <b>{blog.date}</b> {blog.edited ? <p>(edited)</p> : null }</p> : 
                                <div>
                                  <p>Date Added: <b>{blog.date}</b></p>
                                  <p>Date Published: <b>{blog.datePublished}</b> {blog.edited ? '(edited)' : null }</p>
                                </div>
                                }
                              </div>
                          </Link>
                      </div>
                  ))}
              </div>
        </div>

        );
}
 
export default OwnBlogs;