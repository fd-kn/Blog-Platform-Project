import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseconfig";
import { useState } from "react";
import {v4 as uuidv4} from 'uuid';
import ConfirmModal from "./ConfirmModal";



const CreatePost = () => {
    
    const [title, setTitle] = useState('')
    const [post, setPost] = useState('')
    const [showModal, setShowModal] = useState(false);


    var userID;
    if(JSON.parse(localStorage.getItem('userID'))){
        userID = JSON.parse(localStorage.getItem('userID'));
    } else{
        userID = '';
    }

    

    const handlePost = async (event) => {
        if (event) {
            event.preventDefault();
        }


        var nameofUser = 'N/A'

        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds()

        const fDate = `${day}/${month}/${year}`;
        const fTime = `${hours}:${minutes}:${seconds}`;

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
                post: post.split('\n'),
                id: userID,
                userName: nameofUser,
                blogID: randomID,
                dateAdded: fDate,
                timeAdded: fTime,
                datePublished: 0,
                timePublished: 0,
                isPublished: false
            });
            window.location.replace('/ownblogs')
            console.log("Data added to Firestore successfully");
        } catch (error) {
            console.error("Error adding data to Firestore:", error);
        }}

        const handleConfirmation = async () => {
            setShowModal(false);
            await handlePost();
        };

        const handleCancel = () => {
            setShowModal(false);
            window.location.replace('/blogs')

          };    



    return (
        <div className="">
            <h1 className="flex justify-center text-3xl mt-10">Create Blog Post</h1>
            <div className="flex justify-center mt-10">
                <div className="">
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
                    <div className=" pb-4"> 
                        <textarea className="p-2 resize-none w-full h-64 
                        bg-transparent border-2 border-gray-300 rounded-md text-xl 
                        whitespace-pre-wrap"   
                         required placeholder='Enter blog content...'
                         onChange={(e) => { setPost(e.target.value)}}
                        ></textarea>
                    </div>

                    <ConfirmModal
                        isOpen={showModal}
                        message="Do you wish to save your work?"
                        onConfirm={handleConfirmation}
                        onCancel={handleCancel}
                    />

                    <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300" type="submit">Save Draft</button>
                </form>

                <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300"  onClick={()=>setShowModal(true)}>Cancel</button>  {/* onlick go back to blogs page */}
                {/* ADD onclick above TO SAVE CHANGES IF USER CANCELS */}
            </div>
            </div>
        </div> 
     );
}
 
export default CreatePost;