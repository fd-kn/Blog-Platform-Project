import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebaseconfig";
import { Link } from "react-router-dom";

const BlogTemplate = () => {
    
    const [allblogs, setAllblogs] = useState([])

    var blogID;
    if(JSON.parse(localStorage.getItem('blogID'))){
        blogID = JSON.parse(localStorage.getItem('blogID'));
    } else{
        blogID = '';
    }

    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const fDate = `${day}/${month}/${year}`;
    const fTime = `${hours}:${minutes}`;

    useEffect(() => {
        if(blogID !== ''){

        const fetchData = async () => {
          try {
            const queryRef = query(collection(db, 'allBlogs'), where('blogID', "==", blogID));
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
                    setAllblogs(newBlogs);
            })

          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        // Call the async function
        fetchData();}
      }, [blogID]);



    return ( 
        <div>
             
            <div className="flex justify-start m-5">
                {allblogs.map((blog, index) => (
                    <div key={index} className=''>
                            <h1 className="text-3xl pb-4">{blog.title}</h1>
                            <p className="text-2xl pb-5">Post: {blog.post}</p>
                            <p className="text-sm">Written by: <b>{blog.author}</b></p>
                            <p className="text-sm">Date Added: <b>{blog.date}</b></p>
                        
                    </div>
                ))}
            </div>
                    
            <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300" >Publish</button>
            <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300" >Delete</button>
            <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300"><Link to='/ownblogs'>Go Back</Link></button>

        </div>
     );
}
 
export default BlogTemplate;