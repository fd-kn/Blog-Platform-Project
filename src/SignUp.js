import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseconfig";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore"; 



const SignUp = () => {

    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [failure, setFailure] = useState('')

    const handleSubmit = (event) => {

      //!Check database if username already exists
        
        event.preventDefault();
        console.log('hello')
        createUserWithEmailAndPassword(auth, newEmail, newPassword)
        .then(async (userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('success')
            console.log(user.email)

            try {
                await setDoc(doc(db, "users", user.uid), {
                  userName: newName,
                  email: newEmail,
                  profileImage: ''
                  //ADD PROFILE IMAGE STUFF HERE
                });
              
                // Data added successfully
                console.log("Data added to Firestore successfully");
              } catch (error) {
                // Handle Firestore error
                console.error("Error adding data to Firestore:", error);
              }
            
            window.location.replace('/home')
            localStorage.setItem('isSignedIn', JSON.stringify(true));
            localStorage.setItem('userID', JSON.stringify(user.uid))
            
            
        })
        .catch((error) => {
            // Handle the login error
            if (error.code === 'auth/email-already-in-use') {
              // The provided email is not associated with any user account
              console.log('Taken email');
              setFailure('Taken email');

            } else if(error.code === 'auth/weak-password') {
                console.log('Weak password')
                setFailure('Weak password')
            }
             else {
              // Handle other errors
              console.error(error.message);
              console.log('Other error')
              setFailure('Other error')
            }
          });
        
    }

    return ( 
        <div>
            <h1 className="flex justify-center text-3xl mt-10">Sign Up</h1>
            <div className="flex justify-center mt-10">
                <form onSubmit={handleSubmit}>
                    <label className='p-2 m-1 italic '>Username</label>
                    <div>
                        <input className="hover:bg-slate-300 hover:scale-105 
                         duration-300 p-2 bg-transparent border-2 border-gray-300 rounded-md text-xl m-2 mb-4"  
                        type="text" required name="username" placeholder='Enter username...' autoComplete="current-username"
                        onChange={(e) => { setNewName(e.target.value)}}></input>
                    </div>

                    <label className='p-2 m-1 italic '>Email</label>
                    <div>
                        <input className="hover:bg-slate-300 hover:scale-105 
                         duration-300 p-2 bg-transparent border-2 border-gray-300 rounded-md text-xl m-2 mb-4"  
                        type="email" required name="email" placeholder='Enter email address...' autoComplete="current-email"
                        onChange={(e) => { setNewEmail(e.target.value)}}></input>
                    </div>

                    <label className='p-2 m-1 italic '>Password</label>
                    <div>
                        <input className="hover:bg-slate-300 hover:scale-105 
                         duration-300 p-2 bg-transparent border-2 border-gray-300 rounded-md text-xl m-2"   
                        type="password" required name="password" placeholder='Enter password...' autoComplete="current-password"
                        onChange={(e) => { setNewPassword(e.target.value)}}></input>
                    </div>
                    <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300" type="submit">Sign Up</button>
                </form>                
            </div>
            {failure ===  'Taken email' ? <p className="flex justify-center">This email is already in use</p> :
             failure === 'Weak password' ? <p className="flex justify-center">Your password should be atleast 6 characters</p> :
             failure === 'Other error' ? <p className="flex justify-center">An error has occured. Please try again.</p> : null }

        </div>
     );
     
}
 
export default SignUp;