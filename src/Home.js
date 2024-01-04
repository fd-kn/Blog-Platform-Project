import { Link } from "react-router-dom";
import skytreesun from "./skytreesun.jpg"
import { useState } from "react";
// import { auth, db } from "./firebaseconfig";
// import { doc, getDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";


const Home = () => {

    const [selectedImage, setSelectedImage] = useState(null);
    
    var isSignedIn;
    if(JSON.parse(localStorage.getItem('isSignedIn'))){
        isSignedIn = JSON.parse(localStorage.getItem('isSignedIn'));
    } else{
        isSignedIn = false;
    }


    const handleImageUpload = (file) => {
        // Do something with the selected image file (e.g., set it in state)
        setSelectedImage(file);
      };

    return ( 
        <div className="">
            <div className="flex justify-center my-10">
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
                 border-2 border-black rounded-3xl hover:bg-slate-300 
                 hover:scale-110 duration-300"><Link to='/signup'>Sign up now!</Link></button> : null}
            </div>
        {/* {userID ? <p>{user.email}</p> : null} */}
        {/* <p>{userName}</p> */}

        <div className="flex justify-center">
            <img className="mt-4" src={skytreesun} alt="Example Image" />
        </div>

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
}
 
export default Home;