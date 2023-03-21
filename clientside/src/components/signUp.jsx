import axios from "axios"
import { useState } from "react"

const SignUp = ()=>{
    const [userName,setUserName]= useState(null)
    const [firstName,setFirstName]= useState(null)
    const [lastName,setLastName]= useState(null)
    const [email,setEmail]= useState(null)
    const [password,SetPassword]= useState(null)
    const [confirmPassword,setCofirmPassword]= useState(null)
    const [role,setRole]= useState("employee")
    const set = (hook,e)=>{
        hook(e.target.value)
        console.log(userName)
    }
    const register = ()=>{
        axios.post("http://127.0.0.1:3000/api/v1/users/signUp",{userName,firstName,lastName,email,password,confirmPassword,role}).then((data)=>alert("welcome")).catch(err=>alert(err.response.data.message))
    }
    return(<div class="container">
    <div class="row mb-5">
        <div class="col-md-8 col-xl-6 text-center mx-auto">
            <h2>signUp</h2>
            <p>lest create an account !</p>
        </div>
    </div>
    <div class="row d-flex justify-content-center">
        <div class="col-md-6 col-xl-4">
            <div class="card mb-5">
                <div class="card-body d-flex flex-column align-items-center">
                    <div class="bs-icon-xl bs-icon-circle bs-icon-primary bs-icon my-4"><svg class="bi bi-person" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"></path>
                        </svg></div>
                    <form class="text-center" method="post" onSubmit={(e)=>{
                        e.preventDefault()
                        register()
                    }}>
                        <div class="mb-3"><input class="form-control" type="text" placeholder="username" onChange={(e)=>{
                            set(setUserName,e)
                        }}/></div>
                        <div class="mb-3"><input class="form-control" type="text" placeholder="first name" onChange={(e)=>{
                            set(setFirstName,e)
                        }}/></div>
                        <div class="mb-3"><input class="form-control" type="text" placeholder="last name" onChange={(e)=>{
                            set(setLastName,e)
                        }}/></div>
                        <div class="mb-3"><input class="form-control" type="email" placeholder="Email" onChange={(e)=>{
                            set(setEmail,e)
                        }}/></div>
                        <div class="mb-3"><input class="form-control" type="password" placeholder="passowrd" onChange={(e)=>{
                            set(SetPassword,e)
                        }}/></div>
                        <div class="mb-3"><input class="form-control" type="password" placeholder="confirm password" onChange={(e)=>{
                            set(setCofirmPassword,e)
                        }}/></div>
                        <div class="mb-3">
                            <div class="form-check"><input checked id="formCheck-1" class="form-check-input" name="type "type="radio" value="employee" onChange={(e)=>{
                                setRole(e.target.value)
                            }} /><label class="form-check-label" for="formCheck-1">employee</label></div>
                            <div class="form-check"><input id="formCheck-2" class="form-check-input" value="admin" name="type "type="radio"  onChange={(e)=>{
                                setRole(e.target.value)
                            }}/><label class="form-check-label" for="formCheck-2" >admin</label></div>
                        </div>
                        <div class="mb-3"><button class="btn btn-primary d-block w-100" type="submit">signUp</button></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>)
}
export default SignUp