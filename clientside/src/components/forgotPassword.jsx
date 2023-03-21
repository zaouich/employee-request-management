
import axios from "axios"
import { useState } from "react"
const ForgotPassword = ()=>{
    const [email,setEmail] = useState(null)
    const sendEmail = ()=>{
        axios.post("http://127.0.0.1:3000/api/v1/users/forgotPassword",{email}).then((data)=>alert("sent to your email")).catch(err=>alert("error during sending mail"))
    }
    return(
        <div class="row pt-5">
    <div class="col-md-8 text-center text-md-start mx-auto">
        <div class="text-center">
            <h1 class="display-4 fw-bold mb-5">lest reset your password.</h1>
            <p class="fs-5 text-muted mb-5">enter you email and lets me do the work</p>
            <form class="d-flex justify-content-center flex-wrap" method="post" onSubmit={(e)=>{
                e.preventDefault()
                sendEmail()
            }}>
                <div class="shadow-lg mb-3"><input class="form-control" type="email" name="email" placeholder="Your Email" onChange={(e)=>{setEmail(e.target.value)}}/></div>
                <div class="shadow-lg mb-3"><button class="btn btn-primary" type="submit">send</button></div>
            </form>
        </div>
    </div>
    <div class="col-12 col-lg-10 mx-auto">
    </div>
</div>
    )
}
export default ForgotPassword