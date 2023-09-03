import '../App.css';
import React,{useState} from "react";
import {useNavigate } from 'react-router-dom';
import hodu from '../joinHodu.png'
import axios from 'axios';

function SignIn(){
    const [id,setId] = useState("")
    const [pw,setPw] = useState("")
    const navigate = useNavigate()
    return(
        <div className='todo-container'>
            <h1 style = {{fontSize : 50}}>Ho-Do List</h1>
            <div style={{textAlign : "center", marginTop:30}}>
                <img style={{width:300}}src={hodu}/>
                <div style={{marginTop:40}}>
                    <input
                    type="text"
                    placeholder="Enter Your ID"
                    onChange={(e)=>{setId(e.target.value)}}
                    style={{fontSize: 20, height: 50, width: "40%", display:'inline-block'}}
                    />
                    <input
                    type="password"
                    placeholder="Enter Your Password"
                    onChange={(e)=>{setPw(e.target.value)}}
                    style={{fontSize: 20, height: 50, width:"40%", display:'inline-block', marginLeft: 10}}
                    />
                </div>
                <button className = 'purpleButton' style = {{marginTop: 20,height:50, fontSize:20, width:"30%"}} 
                onClick={()=>{
                    axios.post('/login',{id:id, pw:pw})
                    .then((result2)=>{
                        if(result2){
                            alert('Welcome!')
                            navigate('/list')
                        }
                        else{
                            alert('Sign in Failed')
                        }
                    })
                }}>Login</button>
            </div>
        </div>
    )
}


export default SignIn