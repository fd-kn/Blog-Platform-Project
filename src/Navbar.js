import { Link, useLocation } from "react-router-dom";
import { auth, db } from "./firebaseconfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import defaultIcon from './Images/defaulticon.jpg'


const Navbar = () => {
    const location = useLocation();

    // const [userName, setUserName] = useState()
    const [showModal, setShowModal] = useState()
    const [image, setImage] = useState()

    var userID;
    if(JSON.parse(localStorage.getItem('userID'))){
        userID = JSON.parse(localStorage.getItem('userID'));
    } else{
        userID = '';
    }

    useEffect(() => {
        if(userID !== ''){
          console.log(userID)
        const fetchData = async () => {
          try {
            const docRef = doc(db, "users", userID);
            const docSnap = await getDoc(docRef);
            
    
            if (docSnap.exists()) {
              // setUserName(docSnap.data().userName);
              if(docSnap.data().profileImage){
                setImage(docSnap.data().profileImage);
            } else {
                setImage(defaultIcon)
            }
            } else {
              console.log("No such document!");
              // setUserName('');
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            console.error('User???')
          }
        };
    
        fetchData();}
      }, [userID]);

    var isSignedIn;
    if(JSON.parse(localStorage.getItem('isSignedIn'))){
        isSignedIn = JSON.parse(localStorage.getItem('isSignedIn'));
    } else{
        isSignedIn = false;
    }

    const handleLogOut = () => {
        signOut(auth).then(() => {
            window.location.replace('/home')
            localStorage.setItem('isSignedIn', JSON.stringify(false));
            localStorage.setItem('userID', JSON.stringify(''))

          }).catch((error) => {
            console.log(error)
          });
    }

    const handleButtonClick = () => {
      setShowModal(true);

    }

    const handleCancel = () => {
      setShowModal(false);
    };


    return ( 
        <div className="bg-sky-100 shadow-lg shadow-blue-200 sm:flex sm:justify-between">
          <div className="flex justify-between">
              <h1 className="text-center flex-grow p-4 text-3xl hover:scale-110 duration-300 "><Link to="/home">The Writer's Block</Link></h1>
              <button className="sm:hidden p-4 text-3xl">=</button>
              {/* //!Put an onclick here so that when the state is changed, new navbar will appear, like the modal */}
          </div>
                <ul className="p-4 sm:flex hidden">
                {/* <div className="pt-2">  */}
                <li className={`pl-12 hover:scale-110 duration-300 ${location.pathname === '/home' || location.pathname === '/' ? 'underline' : 'no-underline'}`}><Link to="/home">Home</Link></li>
                <li className={`pl-12 hover:scale-110 duration-300 ${location.pathname === '/blogs' ? 'underline' : 'no-underline'}`}><Link to="/blogs">Blogs</Link></li>

                    {!(isSignedIn) ?
                         <li className={`pl-12 hover:scale-110 duration-300 ${location.pathname === '/login' ? 'underline' : 'no-underline'}`}><Link to='/login'>Log In</Link></li>
                      : 
                     <div className="sm:flex">
                      <li className={`pl-12 hover:scale-110 duration-300 cursor-pointer ${location.pathname === '/signup' ? 'underline' : 'no-underline'}`} onClick={handleButtonClick}>Log Out</li>
                      <li className="pl-12 "> <Link to='/profile'><img src={image} className='hover:scale-110 duration-300  h-8 w-8  rounded-full' alt='profile'></img></Link></li>
                     </div>
                     }                                
            </ul>

            <ConfirmModal
                    isOpen={showModal}
                    message={'Do you wish to log out?'}
                    onConfirm={handleLogOut}
                    onCancel={handleCancel}
              />
            
    </div>
     );
}
 
export default Navbar;