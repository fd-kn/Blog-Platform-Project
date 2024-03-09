import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebaseconfig";
import  editLogo  from "./Images/EditLogo.png"
import  bookLogo  from "./Images/BookLogo.svg"

const Blogs = () => {

    const [allblogs, setAllblogs] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    // CHECKS IF USER IS SIGNED IN
    var isSignedIn;
    if(JSON.parse(localStorage.getItem('isSignedIn'))){
        isSignedIn = JSON.parse(localStorage.getItem('isSignedIn'));
    } else{
        isSignedIn = false;
    }

    // EXTRACTS DETAILS OF ALL PUBLIC BLOGS FROM THE DATABASE

    useEffect(() => {
        const fetchData = async () => {
          try {
            const queryRef = query(collection(db, 'publicBlogs'));
            await getDocs(queryRef)
            .then((querySnapshot) => {
                const newBlogs = [];
                querySnapshot.forEach((doc) => {
                    const blogDetails = {
                        title: doc.data().title,
                        post: doc.data().post,
                        author: doc.data().userName,
                        date: doc.data().datePublished,
                        time: doc.data().timePublished,
                        blogID: doc.data().blogID,
                        edited: doc.data().edited,
                        blogImage: doc.data().blogImage
                    }
                    newBlogs.push(blogDetails);
                    });

                    // SORTS THE BLOGS FROM NEWEST TO OLDEST 

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
                      setIsLoaded(true);
            })

          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
        fetchData()
      }, []);

      const handlePostClick = (blogID) => {
        localStorage.setItem('blogID', JSON.stringify(blogID));
      }

      const handleMyBlogsClick = () => {
        const draftStorage = JSON.parse(localStorage.getItem('draftStorage'));
        if (draftStorage !== null) {
            localStorage.setItem('draftStorage', JSON.stringify(true));
        } 
        window.location.replace('/ownblogs')
      }


    return ( 
        <div className=" p-10 min-h-screen">
        <div className="">
            
            <div>
            {isSignedIn && isLoaded && (
                <div className="flex justify-center">

                    <div className="">
                        <button className=" rounded-xl bg-blue-200
                        p-3 hover:scale-110 duration-300 hover:bg-blue-400">
                        <Link to = '/createpost' className="flex">
                            Create <img className="h-6 w-6 ml-2" src={editLogo} alt="edit"/>
                        </Link></button> 
                    </div>

                    <div>
                        <button className="rounded-xl  bg-blue-200
                        p-3 ml-5 hover:scale-110 duration-300 hover:bg-blue-400"
                        onClick={handleMyBlogsClick}
                        >
                        <Link to = '/ownblogs' className="flex">
                            My Blogs <img className="h-6 w-6 ml-2" src={bookLogo} alt="my blogs"/> 
                        </Link></button>
                    </div>

                </div>
            )}
            
            <h3 className="m-4 text-2xl">Check out some blogs!</h3>
                <div className="flex flex-wrap justify-start">
                {allblogs.length === 0 && isLoaded ? (
                    <p>No blogs available.</p>
                    ) : (
                     allblogs.map((blog, index) => (
                        <div key={index} onClick={()=>handlePostClick(blog.blogID)} 
                        className="w-5/6 sm:w-8/12 md:w-5/12 lg:w-4/12 xl:w-3/12
                         m-5  rounded-lg shadow-md shadow-gray-200
                        hover:scale-110 duration-300">
                            <Link to={`/blogtemplate/${'Published'}`}>
                                <img className="w-full h-48 rounded-t-lg mb-6 " src={blog.blogImage} alt="nooo" />
                                <h1 className="text-3xl pb-12 p-2 break-words text-center">{blog.title}</h1>
                                <div className="text-xs pl-2 pb-2 break-words">
                                    <p>Written by: <b>{blog.author}</b></p>
                                    <p>Date Published: <b>{blog.date}</b> {blog.edited ? '(edited)' : null }</p>
                                </div>
                            </Link>
                        </div>
                    ))
                    )}
                </div>
            </div>
            </div>
            
            </div>
     );
}
 
export default Blogs;