import '../App.css';
import React, {useState} from "react";
import hodu from '../joinHodu.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp(){
    const [id,setId] = useState("")
    const [pw,setPw] = useState("")
    const navigate = useNavigate()
    return(
        <div className='todo-container'>
            <h1 style = {{fontSize : 50}}>Welcome to Ho-Do List!</h1>
            <div style={{textAlign : "center", marginTop:30}}>
                <img style={{width:300}}src={hodu}/>
                    <div style={{marginTop:40}}>
                        <input
                        type="text"
                        placeholder="Enter ID"
                        onChange={(e)=>{setId(e.target.value)}}
                        style={{fontSize: 20, height: 50, width: "40%", display:'inline-block'}}
                        />
                        <input
                        type="password"
                        placeholder="Enter Password"
                        onChange={(e)=>{setPw(e.target.value)}}
                        style={{fontSize: 20, height: 50, width:"40%", display:'inline-block', marginLeft: 10}}
                        />
                    </div>
                    <button className = 'purpleButton' style = {{marginTop: 20,height:50, fontSize:20, width:"20%"}} 
                    onClick={()=>{
                        const pattern = new RegExp("^[a-zA-Z][0-9a-zA-Z]{4,12}$")
                        if (pattern.test(id)&&pattern.test(pw)){
                            axios.post('/register',{id:id, pw:pw})
                            .then((result)=>{
                                if(result.data=='register success'){
                                    alert('Register Success!')
                                    navigate('/signupComplete')
                                }
                                else{
                                    alert('This ID already exists.')
                                }
                            })
                        }
                        else{
                            alert('The ID and password must be 4 to 12 characters long containing only letters and numbers.')
                        }
                    }}>Join</button>
            </div>
        </div>
    )
}


export default SignUp