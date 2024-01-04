import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebaseconfig";

const Profile = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [userName, setUserName] = useState('');
    const [editingUsername, setEditingUsername] = useState(false); // State to manage the edit mode

    var userID;

    if(JSON.parse(localStorage.getItem('userID'))){
        userID = JSON.parse(localStorage.getItem('userID'));
    } else{
        userID = '';
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "users", userID);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setUserName(docSnap.data().userName);
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

    const handleImageUpload = (file) => {
        setSelectedImage(file);
    };

    const handleEditUsername = () => {
        setEditingUsername(true);
    };

    const handleSaveUsername = async () => {
        try {
            const docRef = doc(db, "users", userID);
            await updateDoc(docRef, { userName }, { merge: true });


            //! FIX THIS AND KEEP REVISING!

            const blogsQuery = query(collection(db, "allBlogs"), where("id", "==", userID));
            const blogDocsSnapshot = await getDocs(blogsQuery);

            blogDocsSnapshot.docs.forEach(async (blogDoc) => {
                // console.log(blogDoc)
                // console.log('hello')
                const blogRef = doc(db, "allBlogs", blogDoc.id);
                await updateDoc(blogRef, { userName: userName }, { merge: true });
            });

            setEditingUsername(false);
            window.location.reload();


        } catch (error) {
            console.error("Error updating username:", error);
        }
    };

    return (
        <div>
            <p className="flex justify-center pt-5">
                {editingUsername ? (
                    <input
                        className="rounded p-1 mr-2 bg-blue-200"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                ) : (
                    <span className="mr-5">{userName}</span>
                )}
                <div className="">
                    <button className='mr-2' onClick={editingUsername ? handleSaveUsername : handleEditUsername}>
                        {editingUsername ? 'Save' : 'Edit'}
                    </button>
                    {editingUsername ? <button onClick={()=> setEditingUsername(false)}>Cancel</button> : null}
                </div>
            </p>

            <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
            />
            {selectedImage && (
                <div>
                    <h2>Preview:</h2>
                    <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                </div>
            )}
        </div>
    );
};

export default Profile;
