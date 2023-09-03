import '../App.css';
import React, { useState, useEffect} from "react";
import axios from 'axios'
import {AiFillEdit, AiFillCheckCircle, AiFillDelete, AiFillIdcard, AiFillUnlock} from "react-icons/ai";
import {useNavigate} from 'react-router-dom';

function List(){
    const [tasks, setTasks] = useState([]);
    const [taskNum, setTaskNum] = useState(0)
    const [isVisible, setIsVisible] = useState([])
    const [newTitle, setNewTitle] = useState("")
    const [newDate, setNewDate] = useState("")
    const navigate = useNavigate()
    useEffect(() => {
        getList();
        getHeight()
    }, [])

    const getList=()=>{
        axios.get("/getList")
        .then((res) => {
        let copy = [...res.data.tasks]
        setTasks(copy);
        })
        .catch((err) => {
        console.log(err);
        })
    }

    const handleRemoveItem = (index) => {
        const updatedItems = [...tasks];
        updatedItems.splice(index, 1);
        setTasks(updatedItems);
      };

    const toggleInvisiblity = (index)=>{
        let copy = [...isVisible]
        let visible = copy[index]
        copy[index] = !visible
        setIsVisible(copy)
    }
    const showEdit = (index)=>{
        toggleInvisiblity(index)
    }

    const getHeight=()=>{
        axios.get('/getList')
        .then((res)=>{
            setTaskNum(res.data.num)
        })
    }
    const height = taskNum*120

    return (
        <div className="todo-container" style={{height: `${height}px`}}>
            <div style={{display:'flex' ,justifyContent:'space-between'}}>
                <button className='circle-button' onClick={()=>{
                    axios.get('/logout')
                    .then(
                        alert('You have been logged out.'),
                        navigate('/')
                    )
                }}><AiFillUnlock/></button>
                <h1 style = {{marginTop: 10, fontSize : 60}}> Ho-Do List</h1>
                <button className='circle-button' onClick={()=>{navigate('/mypage')}}><AiFillIdcard/></button>
            </div>
        <div style={{textAlign : "center",  marginTop: 20}}>
            <input
            type="text"
            placeholder="Enter a task..."
            onChange={(e)=>{setNewTitle(e.target.value)}}
            style={{width: "45%", fontSize: 20, height: 50, marginRight:5}}
            />
            <input
            type="text"
            placeholder="Date(YYMMDD)"
            onChange={(e)=>{setNewDate(e.target.value)}}
            style={{width: "30%", fontSize: 20, height: 50, marginRight:5}}
            />
            <button className = 'purpleButton' style = {{width:"10%", height:50, fontSize:20, display: 'inline-block'}}
            onClick={()=>{
                const titleTest = new RegExp("/^(?!.*<[^>]*>|.*<\/script>)[^\s]{1,30}$/")
                const dateTest = new RegExp("^(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$")
                if (titleTest.test(newTitle)&&dateTest.test(newDate)){
                    axios.post('/add',{date:newDate, title:newTitle})
                }
                else{
                    if(!titleTest.test(newTitle)){
                        alert("Title has to be 1 to 30 characters long.")
                    }
                    else{
                        alert("Enter a valid date format.")
                    }
                }
            }}>Add</button>
        </div>
        <div>
        <ul className='list-group' style={{marginTop:20}} id="taskList">
            {tasks.map((task, index) => (
                <div className="list-group-item" style={{borderRadius: 10, display:'flex', justifyContent:'space-between'}}>
                    {!isVisible[index]?
                    <div style={{display: 'inline-block'}}>
                        <div className='date-column'>
                        <span id="date" className='date'>{"20"+task.date.substring(0,2)+"."+task.date.substring(2,4)+"."+task.date.substring(4,6)+"."}</span>
                        </div>
                        <div className='title-column'>
                        <span id="title" className='title'>{task.title}</span>
                        </div>
                    </div>:
                    <div>
                        <input
                            type="text"
                            value={task.title}
                            onChange={(e)=>{
                                var title = e.target.value
                                let copy = [...tasks]
                                copy[index].title = title
                                setTasks(copy)
                            }}
                            name='title'
                            style={{width: "45%", fontSize:15, height: 18}}
                        />
                        <input
                            type="text"
                            value={task.date}
                            onChange={(e)=>{
                                var date = e.target.value
                                let copy = [...tasks]
                                copy[index].date = date
                                setTasks(copy)
                            }}
                            name='date'
                            style={{width: "35%", fontSize:15, height: 18}}
                        />
                        <button className = 'purpleButton' style = {{width:"9%", height:42, fontSize:20, display: 'inline-block'}} 
                        type = 'submit' onClick={()=>{
                            axios.put('/edit',{
                                title: tasks[index].title,
                                date: tasks[index].date,
                                _id : tasks[index]._id
                            })
                            .then(
                                toggleInvisiblity(index)
                            )
                            .catch((err)=>{
                                console.log(err)
                            })
                        }
                        }><AiFillEdit/></button>
                    </div>}
                    <div style={{textAlign: 'right', flexDirection:'row-reverse', width:"20%"}}>
                        {!isVisible[index]&&<button className='purpleButton' style={{marginRight: 5}} data-id={task._id} type='submit' onClick={()=>{
                            showEdit(index)
                        }}>
                            <AiFillEdit/>
                        </button>}
                        <button className='purpleButton' style={{marginRight: 5}} data-id={task._id} onClick={()=>{
                            var id = task._id
                            axios.delete(`/done/${id}`)
                            .then(
                                handleRemoveItem(index)
                            )
                            .catch((err)=>{
                                console.log(err)
                            })
                        }}>
                            <AiFillCheckCircle/>
                        </button>
                        <button className='purpleButton' style={{marginRight: 5}} data-id={task._id} onClick={()=>{
                            const confirmDelete = window.confirm("Are you sure you want to delete this item?");
                            if (confirmDelete) {
                                var id = task._id
                                axios.delete(`/delete/${id}`)
                                .then(
                                    handleRemoveItem(index)
                                )
                                .catch((err)=>{
                                    console.log(err)
                                })
                            }
                        }}>
                        <AiFillDelete/>
                        </button>
                    </div>
                </div>
            ))}
        </ul>
        </div>
        </div>
    );
}

export default List