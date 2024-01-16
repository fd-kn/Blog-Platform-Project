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
            await getDocs(queryRef)
            .then((querySnapshot) => {
                const newBlogs = [];
                querySnapshot.forEach((doc) => {
                    // console.log('hello')
                    // console.log(doc.data().userName)
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


    return ( 
        <div className=" p-10 min-h-screen">
        <div className="">
            
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
            
            <h3 className="m-4 text-2xl">Check out some blogs!</h3>
                <div className="flex flex-wrap justify-start">
                {allblogs.length === 0 && isLoaded ? (
                    <p>No blogs available.</p>
                    ) : (
                     allblogs.map((blog, index) => (
                        <div key={index} onClick={()=>handlePostClick(blog.blogID)} 
                        className="w-4/5 sm:w-4/5 md:w-4/5 lg:w-2/5 xl:w-2/6
                         m-5 p-5 border-2 solid border-gray-300 rounded-lg 
                        hover:scale-110 duration-300">
                            <Link to={`/blogtemplate/${'Published'}`}>
                                <img className="h-20 w-20" src={blog.blogImage} alt="nooo" />
                                <h1 className="text-4xl flex justify-center pb-10">{blog.title}</h1>
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