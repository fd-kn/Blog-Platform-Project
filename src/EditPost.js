import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebaseconfig";
import { Link } from "react-router-dom";


const EditPost = ({blogId}) => {

    const [title, setTitle] = useState('')
    const [post, setPost] = useState('')
    const [newTitle, setNewTitle] = useState('')
    const [newPost, setNewPost] = useState('')


    
    var blogID;
    if(JSON.parse(localStorage.getItem('blogID'))){
        blogID = JSON.parse(localStorage.getItem('blogID'));
        
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
        
        const fetchData = async () => {
          try {
            const docRef = doc(db, "allBlogs", blogID);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                //  STORE ORIGINAL TITLE AND CONTENT AND DISPLAY IN TEXT BOXES
                setTitle(docSnap.data().title)
                setPost(docSnap.data().post.join('\n'))
            }                     
  }                 

           catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      
      }, [blogID]);

      const handlePost = async (event) => {
        if (event) {
            event.preventDefault();
        }

        var nameofUser = 'N/A'

        // const now = new Date();
        // const day = now.getDate();
        // const month = now.getMonth() + 1;
        // const year = now.getFullYear();
        // const hours = now.getHours();
        // const minutes = now.getMinutes();
        // const seconds = now.getSeconds()

        // const fDate = `${day}/${month}/${year}`;
        // const fTime = `${hours}:${minutes}:${seconds}`;

        try {    

            const docRef = doc(db, "users", userID);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                 nameofUser = (docSnap.data().userName);
            } else {
                 nameofUser = 'N/A'
            }

            const queryRef = query(collection(db, 'allBlogs'), where('blogID', "==", blogID));
            const querySnapshot = await getDocs(queryRef);
            if (!querySnapshot.empty) {
            //   const blogDoc = querySnapshot.docs[0];

              const docRef = doc(db, "allBlogs", blogID);
              await updateDoc(docRef, {
                title: title,
                post: post.split('\n'),
                edited: true
            }, { merge: true });
        }
            window.location.replace('/ownblogs')
            console.log('saved ')

        } catch (error) {
            console.error("Error adding data to Firestore:", error);
        }}
    


    return ( 
        <div className="h-screen">

            <form onSubmit={handlePost}>

            <label className='p-2  italic '>Title</label>
            <div>
                <input className="p-2 bg-transparent border-2 border-gray-300 rounded-md text-xl m-2 mb-4"  
                required placeholder='Enter blog title...' value={title}
                onChange={(e) => { setTitle(e.target.value)}}
                ></input>
            </div>


            <label className='p-2 m-1 italic '>Post</label>
            <div className=" pb-4"> 
                <textarea className="p-2 resize-none w-full h-64 
                bg-transparent border-2 border-gray-300 rounded-md text-xl 
                whitespace-pre-wrap"   
                required placeholder='Enter blog content...' value={post}
                onChange={(e) => { setPost(e.target.value)}}
                ></textarea>
            </div>


            <button className="py-2 px-5 m-2 text-l
            border-2 border-black rounded-xl hover:bg-slate-300 
            hover:scale-110 duration-300" type="submit">Save Changes</button>

            <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300"><Link to="#" onClick={() => window.history.back()}>Cancel</Link>
            </button>

            </form>


        </div>
     );
}
 
export default EditPost;