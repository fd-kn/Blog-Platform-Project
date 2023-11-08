import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseconfig";
import { useState } from "react";

const LogIn = () => {

    const [existEmail, setExistEmail] = useState('')
    const [existPassword, setExistPassword] = useState('')
    const [failure, setFailure] = useState('')


    const handleSubmit = (event) => {
        event.preventDefault();

        signInWithEmailAndPassword(auth, existEmail, existPassword)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('success')
            window.location.replace('/home')
            localStorage.setItem('isSignedIn', JSON.stringify(true));
            localStorage.setItem('userID', JSON.stringify(user.uid))
            console.log(user.email)

            //! Get user id and add to database. Add username to name variable and then 
            //! add to database. Then let user add blog post/story.
            //! Maybe remove blog posts for now and keep it as a story site instead.
            //! Add profile picture and pop up messages whenever user logs in or out.

            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            
            if (errorCode === 'auth/user-not-found') {
                // The provided email is not associated with any user account
                console.log('Email not found.');
                setFailure('Email error')
              } else if (error.code === 'auth/wrong-password') {
                // The provided password is incorrect
                console.log('Incorrect password.');
                setFailure('Password error')

              } else {
                // Handle other errors
                console.error(errorMessage);
                console.log('Error')
                setFailure('Other error')

              }
        });
    }



    return ( 
        <div>
            <h1 className="flex justify-center text-3xl mt-10">Log in</h1>
            <div className="flex justify-center mt-10">
                <form onSubmit={handleSubmit}>

                    <label className='p-2 m-1 italic '>Email</label>
                    <div>
                        <input className="p-2 bg-transparent border-2 border-gray-300 rounded-md text-xl m-2 mb-4"  
                        type="email" required name="email" placeholder='Enter email address...'
                        onChange={(e) => { setExistEmail(e.target.value)}}></input>
                    </div>

                    <label className='p-2 m-1 italic '>Password</label>
                    <div>
                        <input className="p-2 bg-transparent border-2 border-gray-300 rounded-md text-xl m-2 mb-4"   
                        type="password" required name="password" placeholder='Enter password...'
                        onChange={(e) => { setExistPassword(e.target.value)}}></input>
                    </div>
                    <button className="py-2 px-5 m-2 text-l
                    border-2 border-black rounded-xl hover:bg-slate-300 
                    hover:scale-110 duration-300" type="submit">Log In</button>
                </form>
            </div>
            {failure ===  'Email error' ? <p className="flex justify-center">This email is not registered.</p> :
             failure === 'Password error' ? <p className="flex justify-center">Incorrect password</p> :
             failure === 'Other error' ? <p className="flex justify-center">An error has occured. Please try again.</p> : null }

            
        </div>
     );
     
}
 
export default LogIn;