import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import {Route, Routes, useNavigate} from 'react-router-dom'
import List from './component/List'
import SignUp from './component/SignUp'
import hodu from './welcomeHodu.png'
import SignUpComplete from './component/SignUpComplete';
import SignIn from './component/SignIn';
import Mypage from './component/Mypage';

function App() {
  return(
  <div>
    <Routes>
      <Route path='/' element={<Main></Main>}/>
      <Route path='/list' element={<List></List>}/>
      <Route path='/signin' element={<SignIn></SignIn>}/>
      <Route path='/signup' element={<SignUp></SignUp>}/>
      <Route path='/signupComplete' element={<SignUpComplete></SignUpComplete>}/>
      <Route path='/mypage' element={<Mypage></Mypage>}/>
      <Route path='*' element={<div>404 not found</div>}/>
    </Routes>
  </div>
  )
}

function Main(){
  let navigate = useNavigate()
  return (
    <div className="todo-container">
      <h1 style = {{marginTop: 50, fontSize : 50}}> Ho-Do List</h1>
      <div style={{textAlign : "center"}}>
        <img style={{width:500, marginTop:50}}src={hodu}/>
        <div style={{marginTop:50}}>
          <button className="purpleButton" style={{width: 120, height: 50, marginRight: 50, fontSize: 25}}
          onClick={()=>{navigate('/signin')}}>Sign In!</button>
          <button className="purpleButton" style={{width: 120, height: 50,fontSize: 25}} onClick={()=>{navigate('/signup')}}>Sign Up!</button>
        </div>
      </div>
    </div>
  );
}

export default App;
