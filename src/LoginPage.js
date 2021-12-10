import './App.css';
import {useState } from 'react';

function LoginPage(props) {
  const [name,setName] = useState('');
  return !props.isLoggedIn() && <>
    <input type='text' value={name} onChange={(event)=>setName(event.target.value)}></input>
    <button onClick = {()=>props.addCookie(name)}>Login</button>
  </>
}

export default LoginPage;