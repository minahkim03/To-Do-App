import '../App.css';
import React from "react";
import {useNavigate} from 'react-router-dom'
import hodu from '../congratulationsHodu.png'

function SignUpComplete(){
    let navigate = useNavigate()
    return(
        <div>
            <div className='todo-container'>
                <div style={{textAlign : "center", marginTop:40}}>
                    <img style={{width:200}}src={hodu}/>
                    <h1 style = {{fontSize : 36, marginTop: 40}}>You're now a member of Ho-Do List!</h1>
                    <button className = 'purpleButton' style = {{marginTop: 10,height:50, fontSize:20, width:90}} 
                    onClick={()=>{navigate('/')}}>Main</button>
                </div>
            </div>
        </div>
    )
}

export default SignUpComplete