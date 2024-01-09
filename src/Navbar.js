import { Link, useLocation } from "react-router-dom";
import { auth, db } from "./firebaseconfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

const Navbar = () => {
    const location = useLocation();

    const [userName, setUserName] = useState()
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
              console.log("Username:", docSnap.data().userName);
              setUserName(docSnap.data().userName);
              setImage(docSnap.data().profileImage)

            } else {
              console.log("No such document!");
              setUserName('');
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
        <div className="border-b-4 border-b-black ">
            {/* <div className="flex justify-center m-5">
                <h1 className="text-3xl">The Writer's Block</h1>
            </div> */}
            <ul className="flow-root p-4">
                <h1 className="float-left pl-3 text-3xl hover:scale-110 duration-300"><Link to="/home">The Writer's Block</Link></h1>
                <div className="pt-2"> 
                    {!(isSignedIn) ?
                    <div>
                         <li className={`float-right pr-12 hover:scale-110 duration-300 ${location.pathname === '/login' ? 'underline' : 'no-underline'}`}><Link to='/login'>Log In</Link></li>
                         <li className={`float-right pr-12 hover:scale-110 duration-300 ${location.pathname === '/signup' ? 'underline' : 'no-underline'}`}><Link to='/signup'>Sign Up</Link></li>
                     </div> : 
                     <div>
                       <Link to='/profile'><img src={image} className='hover:scale-110 duration-300 float-right h-8 w-8  rounded-full' alt='profile image'></img></Link>  
                        {/* <li className={`float-right  hover:scale-110 duration-300 text-orange-400 ${location.pathname === '/profile' ? 'underline' : 'no-underline'}`}><Link to='/profile'>{userName}</Link></li> */}
                         <li className={`float-right pr-12 hover:scale-110 duration-300 ${location.pathname === '/signup' ? 'underline' : 'no-underline'}`} onClick={handleButtonClick}>Log Out</li>
                     </div>
                     }

                    {/* <li className={`float-right pr-12 hover:scale-110 duration-300 ${location.pathname === '/settings' ? 'underline' : 'no-underline'}`}><Link to='/settings'>Settings</Link></li> */}
                    {/* <li className={`float-right pr-12 hover:scale-110 duration-300 ${location.pathname === '/stories' ? 'underline' : 'no-underline'}`}><Link to='/stories'>Stories</Link></li> */}
                    <li className={`float-right pr-12 hover:scale-110 duration-300 ${location.pathname === '/blogs' ? 'underline' : 'no-underline'}`}><Link to="/blogs">Blogs</Link></li>
                    <li className={`float-right pr-12 hover:scale-110 duration-300 ${location.pathname === '/home' || location.pathname === '/' ? 'underline' : 'no-underline'}`}><Link to="/home">Home</Link></li>
                
               <ConfirmModal
                    isOpen={showModal}
                    message={'Do you wish to log out?'}
                    onConfirm={handleLogOut}
                    onCancel={handleCancel}
              />
                
                </div>
                
            </ul>

            
    </div>
     );
}
 
export default Navbar;