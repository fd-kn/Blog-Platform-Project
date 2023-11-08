import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseconfig";
import { useState } from "react";
import {v4 as uuidv4} from 'uuid';
import { Link } from "react-router-dom";


const CreatePost = () => {
    
    const [title, setTitle] = useState('')
    const [post, setPost] = useState('')

    var userID;
    if(JSON.parse(localStorage.getItem('userID'))){
        userID = JSON.parse(localStorage.getItem('userID'));
    } else{
        userID = '';
    }

    

    const handlePost = async (event) => {
        event.preventDefault();

        var nameofUser = 'N/A'

        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const fDate = `${day}/${month}/${year}`;
        const fTime = `${hours}:${minutes}`;

        try {
            const docRef = doc(db, "users", userID);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                 nameofUser = (docSnap.data().userName);
            } else {
                 nameofUser = 'N/A'
            }
            const randomID = uuidv4()
            await setDoc(doc(db, "allBlogs", randomID), {
                title: title,
                post: post,
                id: userID,
                userName: nameofUser,
                blogID: randomID,
                dateAdded: fDate,
                timeAdded: fTime
            });
            window.location.replace('/ownblogs')
            console.log("Data added to Firestore successfully");
        } catch (error) {
            console.error("Error adding data to Firestore:", error);
        }}



    return (
        <div className="">
            <h1 className="flex justify-center text-3xl mt-10">Create Blog Post</h1>
            <div className="flex justify-center mt-10">
                <form onSubmit={handlePost}>

                    <label className='p-2 m-1 italic '>Title</label>
                    <div>
                        <input className="p-2 bg-transparent border-2 border-gray-300 rounded-md text-xl m-2 mb-4"  
                         required placeholder='Enter blog title...'
                         onChange={(e) => { setTitle(e.target.value)}}
                        ></input>
                    </div>

                    {/* MAKE TEXTAREA BIGGER */}

                    <label className='p-2 m-1 italic '>Post</label>
                    <div className="w-full h-full mb-4"> 
                        <textarea className="p-2 h-full resize-none w-full bg-transparent border-2 border-gray-300 rounded-md text-xl m-2 mb-4"   
                         required placeholder='Enter blog content...'
                         onChange={(e) => { setPost(e.target.value)}}
                        ></textarea>
                    </div>
                    <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300" type="submit">Save Draft</button>
                    <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300"><Link to='/blogs'>Cancel</Link></button>  {/* onlick go back to blogs page */}
                </form>
            </div>
        </div> 
     );
}
 
export default CreatePost;