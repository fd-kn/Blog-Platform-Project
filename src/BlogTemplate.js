import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebaseconfig";
import { Link } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import backArrow from "./Images/backArrow.jpg";

const BlogTemplate = ({isPublic}) => {


    const [blogpost, setBlogpost] = useState()
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState('');
    const [storeId, setStoreId] = useState('')
    const [notification, setNotification] = useState('');



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
                        userID: userID,
                        isPublished: doc.data().isPublished,
                        datePublished: doc.data().datePublished,
                        timePublished: doc.data().timePublished,
                        edited: doc.data().edited,
                        blogImage: doc.data().blogImage                    

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
      });


      const deleteBlog = async (blogID) => {
        await deleteDoc(doc(db, "allBlogs", blogID));        
        window.location.replace('/ownblogs')

      }


      const unpublishBlog = async (blogID) => {
        const blogRef = doc(db, 'allBlogs', blogID);
        await deleteDoc(doc(db, "publicBlogs", blogID));
        await updateDoc(blogRef, { datePublished: 0, timePublished: 0, isPublished: false });

        
        window.location.replace('/ownblogs')

      }

      const publishBlog = async () => {

        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds()

        const fDate = `${day}/${month}/${year}`;
        const fTime = `${hours}:${minutes}:${seconds}`;

        const blogRef = doc(db, 'allBlogs', blogID);
        try {

          await updateDoc(blogRef, { datePublished: fDate, timePublished: fTime, isPublished: true }, { merge: true });
          await setDoc(doc(db, "publicBlogs", blogID), {
              title: blogpost.title,
              post: blogpost.post,
              id: blogpost.userID,
              userName: blogpost.author,
              blogID: blogpost.blogID,
              datePublished: fDate,
              timePublished: fTime,
              edited: blogpost.edited,
              blogImage: blogpost.blogImage
          });


          setNotification('Blog published successfully');

          setTimeout(() => {
            window.location.replace('/blogs');
          }, 2000);         
           console.log("Data added to Firestore successfully");



      } catch (error) {
          console.error("Error adding data to Firestore:", error);
      }
      setShowModal(false);
      }

      const handleConfirmation = (action,storeId) => {
        switch (action) {
          case 'unpublish':
            unpublishBlog(storeId);
            break;
          case 'delete':
            deleteBlog(storeId);
            break;
          case 'publish':
            publishBlog();
            break;
          default:
            break;
        }
      };

      const handleButtonClick = (action, blogID) => {
        setShowModal(true);
        setAction(action);
        setStoreId(blogID);
      }

      const handleCancel = () => {
        setShowModal(false);
      };



    return ( 
        <div className="min-h-screen max-w-screen">
             
            <div className="p-5">


          {/* SUCCESSFUL PUBLISH MESSAGE */}
          {notification && (
          <div className="fixed inset-0 z-50 flex items-start mt-10 justify-center overflow-auto">
            <p className="bg-blue-200 text-black border-2 border-black p-4 rounded-md shadow-md ">
              {notification}
            </p>
          </div>
        )}
  {/* BLOG ISN'T PUBLISHED AND ON OWN BLOGS PAGE */}
  {isPublic === 'NotPublished' && blogpost && blogpost.isPublished === false ? 
           <div>
              <button className="py-2 px-5 m-2 text-l
                    rounded-xl bg-blue-200 hover:bg-blue-400
                    hover:scale-110 duration-300 translate-y-1"><Link to='/ownblogs'><img className="h-6 w-6" src={backArrow} alt="arrow" /></Link></button>
            <button className="py-2 px-5 m-2 text-l
                    rounded-xl bg-blue-200 hover:bg-blue-400  
                    hover:scale-110 duration-300" onClick={()=>handleButtonClick('publish')}>Publish</button>
            <button className="py-2 px-5 m-2 text-l
                  rounded-xl bg-blue-200 hover:bg-blue-400 
                  hover:scale-110 duration-300"><Link to='/editpost'>Edit</Link></button>
            <button className="py-2 px-5 m-2 text-l
                    rounded-xl bg-blue-200 hover:bg-blue-400 
                    hover:scale-110 duration-300" onClick={()=>handleButtonClick('delete', blogID)}>Delete</button>

            </div>
            // BLOG IS PUBLISHED AND ON OWN BLOGS PAGE
                  : isPublic === 'NotPublished' && blogpost &&  blogpost.isPublished === true ?
              <div>
                  <button className="py-2 px-5 m-2 text-l
                  rounded-xl bg-blue-200 hover:bg-blue-400 translate-y-1
                  hover:scale-110 duration-300"><Link to='/ownblogs'><img className="h-6 w-6" src={backArrow} alt="arrow" /></Link></button>
                  <button className="py-2 px-5 m-2 text-l
                  rounded-xl bg-blue-200 hover:bg-blue-400 
                  hover:scale-110 duration-300" onClick={()=>handleButtonClick('unpublish', blogID)}>Unpublish</button> 
                  <button className="py-2 px-5 m-2 text-l
                  rounded-xl bg-blue-200 hover:bg-blue-400 
                  hover:scale-110 duration-300"><Link to='/editpost'>Edit</Link></button>
                </div>  
                // BLOG IS PUBLISHED AND ON PUBLIC BLOGS PAGE
                  :
                  <button className="py-2 px-5 m-2 text-l
                  rounded-xl bg-blue-200 hover:bg-blue-400 translate-y-1 
                  hover:scale-110 duration-300"><Link to='/blogs'><img className="h-6 w-6" src={backArrow} alt="arrow" /></Link></button>
            }

            {blogpost && (
              <div className="mx-auto p-5">
                <h1 className="text-5xl break-words text-center">{blogpost.title}</h1>
                <div className="flex justify-center m-10">
                  <img className="rounded-lg h-72  w-6/7 sm:w-3/5" src={blogpost.blogImage} alt="nooo" />
                </div>
                <div className="flex justify-center">
                      <p className="text-sm mr-6">Written by: <b>{blogpost.author}</b></p>
                      {isPublic === 'NotPublished' && blogpost.isPublished === true ?
                      <div>
                        <p className="text-sm">Date Added: <b>{blogpost.date}</b></p>
                        <p className="text-sm">Date Published: <b>{blogpost.datePublished}</b></p>
                        </div> :
                        isPublic === 'NotPublished' && blogpost.isPublished === false ?
                        <p className="text-sm">Date Added: <b>{blogpost.date}</b></p>:
                        <p className="text-sm">Date Published: <b>{blogpost.datePublished}</b></p>
                      }
                  <p className="translate-x-2 ">{blogpost.edited ? '(edited)' : null}</p>

                </div>
                

                  <div className="text-xl p-10 break-words">
                  
                    {Array.isArray(blogpost.post) ? 
                    blogpost.post.map((postItem, index) => (
                    <p key={index}>{postItem}</p> 
                    )) : blogpost.post }
                  </div>


              </div>
      )}
            </div>
            <ConfirmModal
                isOpen={showModal}
                message={
                  action === 'publish'
                    ? 'Are you sure you want to publish?'
                    : action === 'delete'
                    ? 'Are you sure you want to delete?'
                    : action === 'unpublish'
                    ? 'Are you sure you want to unpublish?'
                    : 'Are you sure?'
                }
                onConfirm={() => handleConfirmation(action, storeId)}
                onCancel={handleCancel}
              />
        </div>
     );
}
 
export default BlogTemplate;