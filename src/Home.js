import { Link } from "react-router-dom";
import  skytreesun  from "./Images/skytreesun.jpg"
import planetrise from "./Images/planetrise.jpg"

// import { auth, db } from "./firebaseconfig";
// import { doc, getDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";


const Home = () => {

    
    var isSignedIn;
    if(JSON.parse(localStorage.getItem('isSignedIn'))){
        isSignedIn = JSON.parse(localStorage.getItem('isSignedIn'));
    } else{
        isSignedIn = false;
    }



    return ( 
        <div className="min-h-screen">
            <div className="flex justify-center p-10">
                <h1 className="text-3xl italic bold underline">Welcome to The Writer's Block!</h1>
            </div>
            <div className='text-center mx-auto w-1/2'>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Odio quidem facere libero ex quis eveniet ipsam unde, 
                    dignissimos esse debitis perspiciatis quaerat consequatur excepturi 
                    obcaecati sint expedita eligendi facilis voluptates!
                </p>
                {(!isSignedIn) ? <button className="py-4 px-10 m-10 text-2xl
                 rounded-3xl bg-blue-200 hover:bg-blue-400 
                 hover:scale-110 duration-300"><Link to='/signup'>Sign up now!</Link></button> 
                 : 
                 <button className="py-4 px-10 m-10 text-2xl
                 rounded-3xl bg-blue-200 hover:bg-blue-400 
                 hover:scale-110 duration-300"><Link to='/createpost'>Start writing!</Link></button>}
            </div>
        {/* {userID ? <p>{user.email}</p> : null} */}
        {/* <p>{userName}</p> */}

        <div className="flex justify-center">
            <img className="h-4/6 w-4/6 rounded-3xl border-red-400 shadow-lg shadow-black border-4 m-5" 
                src={isSignedIn ? planetrise : skytreesun } alt="Example" />
        </div>


        </div>
     );
}
 
export default Home;