import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebaseconfig";

const Blogs = () => {

    const [allblogs, setAllblogs] = useState([])


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
                        date: doc.data().dateAdded,
                        time: doc.data().timeAdded,
                        blogID: doc.data().blogID
                    }
                    newBlogs.push(blogDetails);
                    });



                    newBlogs.sort((a, b) => {
                        const dateTimeA = new Date(`${a.date} ${a.time}`);
                        const dateTimeB = new Date(`${b.date} ${b.time}`);
                        return dateTimeB - dateTimeA;
                      });
            
                      setAllblogs(newBlogs);
                      console.log(newBlogs);
            })

          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
        fetchData()
      }, []);


    return ( 
        <div className="flex justify-center m-10 mt-20">
            {(isSignedIn) ? 
            <div>
                <button className="border-2 rounded-xl border-black
                p-5 hover:scale-110 duration-300 hover:bg-slate-300">
                <Link to = '/createpost'>Create Blog Post</Link></button> 

                <button className="border-2 rounded-xl border-black
                p-5 ml-5 hover:scale-110 duration-300 hover:bg-slate-300">
                <Link to = '/ownblogs'>My Blogs</Link></button>

                <div className="flex justify-start m-5">
                {allblogs.map((blog, index) => (
                    <div key={index}  className="m-5 p-5 border-2 solid border-gray-300 rounded-lg 
                    hover:scale-110 duration-300">
                        <Link to={`/blogtemplate/${'True'}`}>
                            <h1 className="text-3xl pb-4">{blog.title}</h1>
                            <p>Written by: <b>{blog.author}</b></p>
                            <p>Date Added: <b>{blog.date}</b></p>
                        </Link>
                    </div>
                ))}
            </div>
            </div>
            
            : <p>Here are some random blog posts</p>}
        </div>
     );
}
 
export default Blogs;