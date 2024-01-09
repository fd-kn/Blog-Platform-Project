import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "./firebaseconfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Profile = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [userName, setUserName] = useState('');
    const [editingUsername, setEditingUsername] = useState(false);
    const [originalUserName, setOriginalUserName] = useState('');
    const [tempUserName, setTempUserName] = useState('');
    const [imageChange, setImageChange] = useState(false)
    const [ogImage, setOgImage] = useState(null)



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
                    if(docSnap.data().profileImage){
                        setSelectedImage(docSnap.data().profileImage);
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

    return (
        <div className="h-screen">

            {selectedImage && (
                    <div className="flex justify-center m-5">
                        <img className='h-36 w-36 rounded-full'
                        src={selectedImage} alt="Selected" />
                    </div>
                )}

            <div className="m-5">
                <div className="flex justify-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                        id="imageInput"
                        className="absolute opacity-0 w-0 h-0 overflow-hidden"
                        
                    />
                    <label htmlFor="imageInput" 
                        className=" cursor-pointer bg-blue-200 hover:bg-blue-600 p-2 rounded-lg">
                        Upload Image
                    </label>
                </div>

                {imageChange && (
                            <div className="flex justify-center">
                                <button className='p-2' onClick={imageSave}>Save Picture</button>
                                <button className='p-2' onClick={cancelSave}>Cancel</button>
                            </div>
                        )}
            </div>


            <div className="flex justify-center pt-5">
            <div className="p-2">Username: </div>
                {editingUsername ? (
                    <div>
                    <input
                        className="rounded px-3 py-1 mr-2 border-2 border-black bg-blue-200"
                        type="text"
                        value={tempUserName}
                        onChange={(e) => setTempUserName(e.target.value)}
                    />  
                    </div>
                ) : (
                    <span className="rounded px-3 py-1 mr-2 border-2 border-black bg-blue-200">{tempUserName}</span>
                )}
                <div className="">
                    <button className='mr-2 p-2' onClick={editingUsername ? handleSaveUsername : handleEditUsername}>
                        {editingUsername ? 'Save' : 'Edit'}
                    </button>
                    {editingUsername ? <button onClick={handleCancelEdit}>Cancel</button> : null}
                </div>
            </div>
            
        </div>
    );
};

export default Profile;
