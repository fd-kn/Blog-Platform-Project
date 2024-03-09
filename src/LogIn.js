import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseconfig";
import { useState } from "react";
import { Link } from "react-router-dom";

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
        <div className="min-h-screen">
            <h1 className="flex justify-center text-3xl pt-10">Log in</h1>
            <h6 className="flex justify-center pt-4">Don't have an account?<p className="translate-x-2 text-blue-500 underline hover:scale-110 
                         duration-300"><Link to={'/signup'}>Create an account!</Link></p></h6>
            <div className="flex justify-center mt-10">
                <form onSubmit={handleSubmit}>
                    <div className="hover:scale-110 duration-300">
                        <div className="flex flex-col p-2 m-1">
                            <label className='italic font-bold '>Email</label>
                            <label className='italic  '>Test email: testuser99@gmail.com</label>
                        </div>
 

                        <div>
                            <input className="p-2  bg-transparent border-2 border-gray-300 rounded-md text-xl m-2 mb-4"  
                            type="email" required name="email" placeholder='Enter email address...' autoComplete="current-email"
                            onChange={(e) => { setExistEmail(e.target.value)}}></input>
                        </div>
                    </div>

                    <div className="hover:scale-110 duration-300">
                        <div className="flex flex-col p-2 m-1">
                            <label className='italic font-bold '>Password</label>
                            <label className='italic  '>Test password: testuser99</label>
                        </div>
                        <div>
                            <input className="p-2 bg-transparent border-2 border-gray-300 rounded-md text-xl m-2 mb-4"   
                            type="password" required name="password" placeholder='Enter password...' autoComplete="current-password"
                            onChange={(e) => { setExistPassword(e.target.value)}}></input>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button className="py-2 px-5 m-2 text-l
                        rounded-xl bg-blue-200 hover:bg-blue-400
                        hover:scale-110 duration-300" type="submit">Log In</button>
                    </div>
                </form>
            </div>
   

            {failure ===  'Email error' ? <p className="flex justify-center">This email is not registered.</p> :
             failure === 'Password error' ? <p className="flex justify-center">Incorrect password</p> :
             failure === 'Other error' ? <p className="flex justify-center">An error has occured. Please try again.</p> : null }

            
        </div>
     );
     
}
 
export default LogIn;