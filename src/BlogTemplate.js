import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebaseconfig";
import { Link } from "react-router-dom";

const BlogTemplate = ({isPublic}) => {


    const [blogpost, setBlogpost] = useState()


    var blogID;
    if(JSON.parse(localStorage.getItem('blogID'))){
        blogID = JSON.parse(localStorage.getItem('blogID'));
        console.log(isPublic)
    } else{
        blogID = '';
    }

    var userID;
    if(JSON.parse(localStorage.getItem('userID'))){
        userID = JSON.parse(localStorage.getItem('userID'));
    } else{
        userID = '';
    }


    useEffect(() => {
        if(blogID !== ''){

        const fetchData = async () => {
          try {
            const queryRef = query(collection(db, 'allBlogs'), where('blogID', "==", blogID));
            const querySnapshot = await getDocs(queryRef);
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0];
              // The following is info displayed per post so doesn't need to include everything
                    const blogDetails = {
                        title: doc.data().title,
                        post: doc.data().post,
                        author: doc.data().userName,
                        date: doc.data().dateAdded,
                        time: doc.data().timeAdded,
                        blogID: doc.data().blogID,
                        userID: userID
                      };
                    setBlogpost(blogDetails);
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
        await deleteDoc(doc(db, "publicBlogs", blogID));
        
        window.location.replace('/ownblogs')

      }

      const publishBlog = async () => {
        
        try {

          await setDoc(doc(db, "publicBlogs", blogID), {
              title: blogpost.title,
              post: blogpost.post,
              id: blogpost.userID,
              userName: blogpost.author,
              blogID: blogpost.blogID,
              dateAdded: blogpost.date,
              timeAdded: blogpost.time
          });
          window.location.replace('/blogs')
          console.log("Data added to Firestore successfully");
      } catch (error) {
          console.error("Error adding data to Firestore:", error);
      }
      }



    return ( 
        <div>
             
            <div className="flex justify-start m-5">
 
            {blogpost && (
              <div>
                <h1 className="text-3xl pb-4">{blogpost.title}</h1>
                <p className="text-2xl pb-5">Post: {blogpost.post}</p>
                <p className="text-sm">Written by: <b>{blogpost.author}</b></p>
                <p className="text-sm">Date Added: <b>{blogpost.date}</b></p>
              </div>
      )}
            </div>
                    
           {isPublic === 'True' ? 
           <div>
            <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300" onClick={publishBlog}>Publish</button>
            <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300" onClick={()=>deleteBlog(blogID)}>Delete</button>
            </div>
                  : null
            }
            <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300"><Link to='/ownblogs'>Go Back</Link></button>

        </div>
     );
}
 
export default BlogTemplate;