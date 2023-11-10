import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebaseconfig";
import { Link } from "react-router-dom";

const BlogTemplate = () => {
    
    const [allblogs, setAllblogs] = useState()

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
            const querySnapshot = await getDocs(queryRef);
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0];
                    const blogDetails = {
                        title: doc.data().title,
                        post: doc.data().post,
                        author: doc.data().userName,
                        date: doc.data().dateAdded,
                        time: doc.data().timeAdded,
                        blogID: doc.data().blogID
                      };
                    setAllblogs(blogDetails);
            } else{
              console.log("No blog found with the specified blogID");

            }

          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }
      }, [blogID]);
      

      const deleteBlog = async (blogID) => {
        await deleteDoc(doc(db, "allBlogs", blogID));
      }



    return ( 
        <div>
             
            <div className="flex justify-start m-5">
 
            {allblogs && (
              <div>
                <h1 className="text-3xl pb-4">{allblogs.title}</h1>
                <p className="text-2xl pb-5">Post: {allblogs.post}</p>
                <p className="text-sm">Written by: <b>{allblogs.author}</b></p>
                <p className="text-sm">Date Added: <b>{allblogs.date}</b></p>
              </div>
      )}
            </div>
                    
            <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300" >Publish</button>
            <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300" onClick={()=>deleteBlog(blogID)}><Link to={'/ownblogs'}>Delete</Link></button>
            <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300"><Link to='/ownblogs'>Go Back</Link></button>

        </div>
     );
}
 
export default BlogTemplate;