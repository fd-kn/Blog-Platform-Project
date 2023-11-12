import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebaseconfig";
import { Link } from "react-router-dom";

const OwnBlogs = () => {


    const [allblogs, setAllblogs] = useState([])

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
        };
    
        fetchData();}
      }, [userID]);


      const handlePostClick = (blogID) => {
        localStorage.setItem('blogID', JSON.stringify(blogID));
      }


    return ( 
        <div>
        <h1 className="flex justify-start m-5 text-3xl italic">My Blogs</h1>
            <div className="flex justify-start m-5">
                {allblogs.map((blog, index) => (
                    <div key={index} onClick={()=>handlePostClick(blog.blogID)} className="m-5 p-5 border-2 solid border-gray-300 rounded-lg 
                    hover:scale-110 duration-300">
                        <Link to={`/blogtemplate/${'False'}`}>
                            <h1 className="text-3xl pb-4">{blog.title}</h1>
                            <p>Written by: <b>{blog.author}</b></p>
                            <p>Date Added: <b>{blog.date}</b></p>
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