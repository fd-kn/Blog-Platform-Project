import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebaseconfig";
import { Link } from "react-router-dom";

const OwnBlogs = () => {


    const [allblogs, setAllblogs] = useState([]);
    const [isDraft, setIsDraft] = useState(true);
    const [draftBlogs, setDraftBlogs] = useState([]);
    const [publishedBlogs, setPublishedBlogs] = useState([])

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
                        edited: doc.data().edited
                    }
                    newBlogs.push(blogDetails);
                    });



                    newBlogs.sort((a, b) => {
                      // console.log(a.date)
                      // console.log(a.time)
                      const [dayA, monthA, yearA] = a.date.split('/');
                      const [hourA, minuteA, secondA] = a.time.split(':');
                    
                      const [dayB, monthB, yearB] = b.date.split('/');
                      const [hourB, minuteB, secondB] = b.time.split(':');

                    
                      const dateTimeA = new Date(yearA, monthA - 1, dayA, hourA, minuteA, secondA);
                      const dateTimeB = new Date(yearB, monthB - 1, dayB, hourB, minuteB, secondB);

                      //  console.log(dateTimeA)
                      return dateTimeB - dateTimeA;
                    });
            
                      setAllblogs(newBlogs);
                      setDraftBlogs(newBlogs.filter(blog => blog.isPublished === false));
                      setPublishedBlogs(newBlogs.filter(blog => blog.isPublished === true));


                      // console.log(newBlogs);
            })

          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();}
      }, []);


      const handlePostClick = (blogID) => {
        localStorage.setItem('blogID', JSON.stringify(blogID));
      }

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
        <div className="h-screen w-screen">
        <h1 className="flex justify-start m-5 text-3xl italic">My Blogs</h1>
        <div className="flex justify-start m-5 text-xl italic"> 
          <button className={`p-2 m-2 hover:scale-110 duration-300 ${isDraft && 'underline'}`} onClick={() => handleSplit('Draft')} >Drafts</button>
          <button className={`p-2 m-2 hover:scale-110 duration-300 ${!isDraft && 'underline'}`} onClick={() => handleSplit('Published')}>Published</button>
        </div>


            <div className="flex flex-wrap justify-start m-5">
                {blogsToMap.map((blog, index) => (
                    <div key={index} onClick={()=>handlePostClick(blog.blogID)} 
                    className=" w-2/5 m-5 p-5 border-2 solid border-gray-300 rounded-lg 
                    hover:scale-110 duration-300">
                        <Link to={`/blogtemplate/${'NotPublished'}`}>
                            <h1 className="text-4xl flex justify-center pb-10">{blog.title}</h1>
                            <p>Written by: <b>{blog.author}</b></p>
                            {isDraft ? <p>Date Added: <b>{blog.date}</b></p> : 
                            <div>
                              <p>Date Added: <b>{blog.date}</b></p>
                              <p>Date Published: <b>{blog.datePublished}</b></p>
                            </div>
                             }
                            

                        </Link>
                    </div>
                ))}
            </div>
            <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300"><Link to='/blogs'>Back</Link>
            </button>
        </div>

        );
}
 
export default OwnBlogs;