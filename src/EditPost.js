import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "./firebaseconfig";
import { Link } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const EditPost = ({blogId}) => {

    const [title, setTitle] = useState('')
    const [post, setPost] = useState('')
    const [image, setImage] = useState('')
    // const [newTitle, setNewTitle] = useState('')
    // const [newPost, setNewPost] = useState('')


    
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
                setImage(docSnap.data().blogImage)
                console.log(docSnap.data().blogImage)
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

            console.log('hellooo')

            const docRef = doc(db, "users", userID);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                 nameofUser = (docSnap.data().userName);
            } else {
                 nameofUser = 'N/A'
            }

            //UPDATING BLOG IN ALLBLOGS COLLECTION IN FIREBASE
              const docBlogRef = doc(db, "allBlogs", blogID);
              await updateDoc(docBlogRef, {
                title: title,
                post: post.split('\n'),
                blogImage: image,
                edited: true
            }, { merge: true });

            //UPDATING BLOG IN PUBLIC COLLECTION IN FIREBASE - but first checks if the blog is published
            //IF NOT, THEN IT WILL ONLY BE UPDATED IN allBlogs SINCE IT DOESN'T EXIST IN publicBlogs

            if((await getDoc(doc(db, 'publicBlogs', blogID))).exists()){
                const docPublicRef = doc(db, 'publicBlogs', blogID);
                await updateDoc(docPublicRef, {
                    title: title,
                    post: post.split('\n'),
                    blogImage: image,
                    edited: true
                }, { merge: true})
            }


            window.location.replace('/ownblogs')
            console.log('saved ')

        } catch (error) {
            console.error("Error adding data to Firestore:", error);
        }}
    
        const handleImageUpload = async (file) => {
            //! Save to new folder in storage - like blog posts - with blog id
            //! Add the saving of the image once the post has been created
            //! Just store the url into an image state from here to display it here

            try{
                const storageRef = ref(storage, `tempPostImages/${userID}/${file.name}`);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                setImage(downloadURL);
            }catch(error){
                console.error("Error uploading preview image", error);
    
            }

        }

    return ( 
        <div className="min-h-screen">
            <h1 className="flex justify-center text-3xl pt-10">Edit Blog Post</h1>

            <div className="p-4 w-4/5 mt-10">
            <form onSubmit={handlePost}>

            <label className='p-2 italic text-xl font-bold'>Title</label>
            <div>
                <input className="p-2 bg-transparent border-2 border-gray-300 bg-sky-200 rounded-md text-xl mt-4 mb-10"  
                required placeholder='Enter blog title...' value={title}
                onChange={(e) => { setTitle(e.target.value)}}
                ></input>
            </div>

            {image && (
                <div className="mb-6">
                    <img className='h-60 w-96 border-4 border-black'
                    src={image} alt="original" />
                    </div>
            )}
            
            <div>
                        <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                            id="imageInput"
                            className="absolute opacity-0 w-0 h-0 overflow-hidden"
                            // required
                            
                        />
                        <label htmlFor="imageInput" 
                            title="Please select an image"
                            className="hover:scale-110 duration-300 cursor-pointer
                            bg-blue-200 hover:bg-blue-400 p-2 rounded-lg">
                            Change Image
                        </label>
                    </div>



            <div className="pb-4 mt-10"> 
                <label className='p-2 text-xl font-bold  italic '>Post</label>
                <textarea className="p-2 mt-4 resize-none w-full h-64 
                bg-transparent border-2 bg-sky-200 border-gray-300 rounded-md text-xl 
                whitespace-pre-wrap"   
                required placeholder='Enter blog content...' value={post}
                onChange={(e) => { setPost(e.target.value)}}
                ></textarea>
            </div>


            <button className="py-2 px-5 m-2 text-l
             bg-blue-200 hover:bg-blue-400 rounded-xl
             hover:scale-110 duration-300" type="submit">Save Changes</button>

            <button className="py-2 px-5 m-2 text-l
                     bg-blue-200 hover:bg-blue-400 rounded-xl
                     hover:scale-110 duration-300"><Link to="#" onClick={() => window.history.back()}>Cancel</Link>
            </button>

            </form>

            </div>
        </div>
     );
}
 
export default EditPost;