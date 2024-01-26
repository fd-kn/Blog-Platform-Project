import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "./firebaseconfig";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import defaultIcon from './Images/defaulticon.jpg'
import ConfirmModal from "./ConfirmModal";

const Profile = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [userName, setUserName] = useState('');
    const [editingUsername, setEditingUsername] = useState(false);
    const [originalUserName, setOriginalUserName] = useState('');
    const [tempUserName, setTempUserName] = useState('');
    const [imageChange, setImageChange] = useState(false)
    const [ogImage, setOgImage] = useState(null)
    const [email, setEmail] = useState('')
    const [showModal, setShowModal] = useState(false);



    var userID;

    if(JSON.parse(localStorage.getItem('userID'))){
        userID = JSON.parse(localStorage.getItem('userID'));
    } else{
        userID = '';
    }


    useEffect(() => {
        setOriginalUserName(userName);
        setTempUserName(userName);
    }, [userName]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "users", userID);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setUserName(docSnap.data().userName);
                    setEmail(docSnap.data().email);
                    if(docSnap.data().profileImage){
                        setSelectedImage(docSnap.data().profileImage);
                    }else{
                        setSelectedImage(defaultIcon)
                    }
                } else {
                    setUserName('');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (userID !== '') {
            fetchData();
        }
    }, [userID]);

    const handleImageUpload = async (file) => {
        setOgImage(selectedImage);
        try{
            const storageRef = ref(storage, `profileImages/${userID}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setSelectedImage(downloadURL);
        }catch(error){
            console.error("Error uploading preview image", error);

        }
        console.log('here');
        setImageChange(true);
    };

    const handleEditUsername = () => {
        setEditingUsername(true);
    };

    const handleSaveUsername = async () => {
        try {

            if(tempUserName.trim() === '') {
                return null
            }
            const docRef = doc(db, "users", userID);
            await updateDoc(docRef, {userName:tempUserName }, { merge: true });

            //UPDATING NAME IN OWN BLOGS
            const blogsQuery = query(collection(db, "allBlogs"), where("id", "==", userID));
            const blogDocsSnapshot = await getDocs(blogsQuery);

            blogDocsSnapshot.docs.forEach(async (blogDoc) => {

                const blogRef = doc(db, "allBlogs", blogDoc.id);
                await updateDoc(blogRef, { userName: tempUserName }, { merge: true });
            });

            //UPDATING NAME IN PUBLIC BLOGS
            const publicblogsQuery = query(collection(db, "publicBlogs"), where("id", "==", userID));
            const publicblogDocsSnapshot = await getDocs(publicblogsQuery);

            publicblogDocsSnapshot.docs.forEach(async (blogDoc) => {

                const publicblogRef = doc(db, "publicBlogs", blogDoc.id);
                await updateDoc(publicblogRef, { userName: tempUserName }, { merge: true });
            });

            setEditingUsername(false);
            window.location.reload();


        } catch (error) {
            console.error("Error updating username:", error);
        }
    };


    const handleCancelEdit = () => {
        setEditingUsername(false);
        setTempUserName(originalUserName);
    };

    const imageSave = async () => {

        try {      
            const docRef = doc(db, "users", userID);
            await updateDoc(docRef, { profileImage: selectedImage }, { merge: true });

        } catch(error){
            console.error("Error uploading image:", error);
        }

        window.location.reload();
    }

    const cancelSave = () => {
        setImageChange(false)
        setSelectedImage(ogImage)
    }

    const deleteImage = async () => {
        try {
        //   const storageRef = ref(storage, `profileImages/${userID}`);
        //   await deleteObject(storageRef);
    
          // Update the user's document in Firestore to remove the profileImage field
          const docRef = doc(db, "users", userID);
          await updateDoc(docRef, { profileImage: '' }, { merge: true });
    
          // Reload the page to reflect the changes
          window.location.reload();
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }

    const handleDeleteClick = () => {
        if(selectedImage !== defaultIcon){
            setShowModal(true);
        }
    }

    const handleCancel = () => {
        setShowModal(false);
      };

    return (
        <div className="bg-gradient-to-br from-blue-200 via-purple-400 to-blue-200 min-h-screen">

            {selectedImage && (
                    <div className="flex justify-center p-5">
                        <img className='h-36 w-36 rounded-full border-4 border-black'
                        src={selectedImage} alt="Selected" />
                    </div>
                )}

            <div className="p-5">
                <div className="flex justify-center">
                    <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                        id="imageInput"
                        className="absolute opacity-0 w-0 h-0 overflow-hidden"
                        
                    />
                    <label htmlFor="imageInput" 
                        className="hover:scale-110 duration-300 cursor-pointer bg-blue-200 hover:bg-blue-400 p-2 rounded-lg">
                        Upload Image
                    </label>

                    <button onClick={handleDeleteClick} 
                        className=" hover:scale-110 duration-300 cursor-pointer bg-blue-200 hover:bg-blue-400 p-2 rounded-lg ml-4">
                        Remove Image
                    </button>

                </div>

                <ConfirmModal
                    isOpen={showModal}
                    message={'Do you wish to remove your profile image?'}
                    onConfirm={deleteImage}
                    onCancel={handleCancel}
              />


                {imageChange && (
                            <div className="flex justify-center fixed inset-0 z-50 items-center overflow-auto bg-black bg-opacity-50">
                                <div className="border-2 border-black bg-red-200 p-4 rounded-lg">
                                    <button className='mx-6 p-2 border-2 rounded-lg bg-blue-200  hover:bg-blue-400 border-black hover:scale-110 duration-300' onClick={imageSave}>Save Image</button>
                                    <button className='mx-6 p-2 border-2 rounded-lg bg-blue-200  hover:bg-blue-400 border-black hover:scale-110 duration-300' onClick={cancelSave}>Cancel</button>
                                </div>
                            </div>
                        )}
            </div>


            <div className="flex justify-center pt-5">
                <div className="pr-2">Username: </div>
                    {editingUsername ? (
                        <div>
                        <div>
                        <input 
                            required
                            className="rounded pl-1  mr-2 border-2 border-black bg-blue-200"
                            type="text"
                            value={tempUserName}
                            onChange={(e) => setTempUserName(e.target.value)}
                        />  
                        </div>
                         {tempUserName.trim() === '' && (
                            <span className="text-red-500">Username is required</span>
                        )}
                        </div>
                    ) : (
                        <span className="pr-6"> {tempUserName}</span>
                    )}
                    <div className="">
                        <button className='hover:scale-110 duration-300 cursor-pointer bg-blue-200 hover:bg-blue-400
                         px-3 py-1 rounded-lg ' onClick={editingUsername ? handleSaveUsername : handleEditUsername}>
                            {editingUsername ? ':)' : 'Edit'}
                        </button>
                        {editingUsername ? <button className='hover:scale-110 duration-300 cursor-pointer bg-blue-200 hover:bg-blue-400
                         px-3 py-1 rounded-lg ml-2 'onClick={handleCancelEdit}>X</button> : null}
                    </div>
            </div>
            <div className="flex justify-center pt-5">
                <p className="pr-2">Email:</p> {email}
            </div>
        </div>
        //! ANIMATION STUFF? hover:-translate-x-10 duration-300
    );
};

export default Profile;
