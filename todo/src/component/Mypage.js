import '../App.css';
import React,{useState, useEffect} from "react";
import {useNavigate } from 'react-router-dom';
import axios from 'axios';
import hodu from '../giddyUpHodu.png'

function Mypage(){
    const [id, setId] = useState('')
    const [all, setAll] = useState(0)
    const [comp, setComp] = useState(0)
    const navigate = useNavigate()
    useEffect(() => {
        getData();
    }, [])

    const getData=()=>{
        axios.get('/getData')
        .then((res)=>{
            setId(res.data.id)
            setAll(res.data.all)
            setComp(res.data.comp)
        })
    }
    const completionRate = (comp/ all) * 100 || 0

    return(
        <div className='todo-container'>
            <h1 style = {{fontSize : 50}}>{id}'s Ho-Do List</h1>
            <div style={{textAlign : "center", marginTop: 30}}>
                <div>
                    <img style={{width:200, alignItems:'center', marginTop:30}}src={hodu}/>
                </div>
                <div className="app">
                    <div className="todo-stats">
                        <p>Completed: {comp}</p>
                        <p>Total: {all}</p>
                        <p>Completion Rate: {completionRate.toFixed(2)}%</p>
                        <div className="progress" style={{backgroundColor: '#8b898c'}}>
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${completionRate}%` , backgroundColor: '#5454a1'}}
                                aria-valuenow={completionRate}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                </div>
                <button className = 'purpleButton' style = {{marginTop: 40, height:50, fontSize:20, width:"20%"}} 
                onClick={()=>{navigate('/list')}}>Back</button>
            </div>
        </div>
    )
}

export default Mypage