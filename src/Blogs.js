import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebaseconfig";

const Blogs = () => {

    const [allblogs, setAllblogs] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)


    var isSignedIn;
    if(JSON.parse(localStorage.getItem('isSignedIn'))){
        isSignedIn = JSON.parse(localStorage.getItem('isSignedIn'));
    } else{
        isSignedIn = false;
    }


    useEffect(() => {
        const fetchData = async () => {
          try {
            const queryRef = query(collection(db, 'publicBlogs'));
            getDocs(queryRef)
            .then((querySnapshot) => {
                const newBlogs = [];
                querySnapshot.forEach((doc) => {
                    const blogDetails = {
                        title: doc.data().title,
                        post: doc.data().post,
                        author: doc.data().userName,
                        date: doc.data().datePublished,
                        time: doc.data().timePublished,
                        blogID: doc.data().blogID
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
                      console.log(newBlogs);
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


    return ( 
        <div className="h-screen">
        <div className=" m-10 mt-20">
            
            <div>
            {isSignedIn && isLoaded && (
                <div className="flex justify-center">
                    <div>
                        <button className="border-2 rounded-xl border-black
                        p-5 hover:scale-110 duration-300 hover:bg-slate-300 ">
                        <Link to = '/createpost'>Create Blog Post</Link></button> 
                    </div>
                    <div>
                        <button className="border-2 rounded-xl border-black
                        p-5 ml-5 hover:scale-110 duration-300 hover:bg-slate-300">
                        <Link to = '/ownblogs'>My Blogs</Link></button>
                    </div>
                </div>
            )}
            
                <div className="flex flex-wrap justify-start m-5">
                {allblogs.length === 0 && isLoaded ? (
                    <p>No blogs available.</p>
                    ) : (
                     allblogs.map((blog, index) => (
                        <div key={index} onClick={()=>handlePostClick(blog.blogID)} 
                        className=" w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6
                         m-5 p-5 border-2 solid border-gray-300 rounded-lg 
                        hover:scale-110 duration-300">
                            <Link to={`/blogtemplate/${'Published'}`}>
                                <h1 className="text-3xl pb-4">{blog.title}</h1>
                                <p>Written by: <b>{blog.author}</b></p>
                                <p>Date Published: <b>{blog.date}</b></p>
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