import { Link } from "react-router-dom";

const Blogs = () => {

    var isSignedIn;
    if(JSON.parse(localStorage.getItem('isSignedIn'))){
        isSignedIn = JSON.parse(localStorage.getItem('isSignedIn'));
    } else{
        isSignedIn = false;
    }


    return ( 
        <div className="flex justify-center m-10 mt-20">
            {(isSignedIn) ? 
            <div>
                <button className="border-2 rounded-xl border-black
                p-5 hover:scale-110 duration-300 hover:bg-slate-300">
                <Link to = '/createpost'>Create Blog Post</Link></button> 

                <button className="border-2 rounded-xl border-black
                p-5 ml-5 hover:scale-110 duration-300 hover:bg-slate-300">
                <Link to = '/ownblogs'>My Blogs</Link></button>
            </div>
            
            : <p>Here are some random blog posts</p>}
        </div>
     );
}
 
export default Blogs;