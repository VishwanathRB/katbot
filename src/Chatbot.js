import React, { useEffect,useState } from 'react';
import {useCookies} from 'react-cookie';
import AvailableOptions from './AvailableOptions';
import LinkList from './LinkList';
import './Chatbot.css'
import loadingImage from './typing-loading.gif';

function ChatBot(props){
    const cookies = useCookies(['user'])[0];
    const [message,setMessage] = useState('');
    const [messages,setMessages] = useState([]);
    useEffect(()=>{
        getInitialMessage();
    },[cookies])

    function getResponse(message) {
        console.log('getRees called')
        const  loading = <img src={loadingImage}></img>;
        setMessages((messages)=>[...messages,<div className='response-style'>{loading}</div>]);
        setTimeout(() => {
            setMessages((messages)=>{
                messages.pop();
                return [...messages,<div className='response-style'>{message}</div>]
            });
        },500);
    }

    function onSend(){
        const userMessage = <div className="request-style">
            {message}
        </div>
        setMessages((messages)=>[...messages,userMessage]);
        parseMessage(message);
        // getResponse(message);

    }

    function parseMessage(message){
        const lowerCaseMessage = message.toLowerCase();
        let isHandled = false;
        if(lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hello')){
            greet();
            isHandled = true;
        }
        if(lowerCaseMessage.includes('weather')){
            handleWeather();
            isHandled = true;
        }
        if(lowerCaseMessage.includes('javascript')){
            handleJavascriptLinks();
            isHandled = true;
        }
        if(lowerCaseMessage.includes('date') || lowerCaseMessage.includes('time')){
            handleTime();
            isHandled = true;
        }
        if(!isHandled){
            handleUnhandledMessage()
        }
        
    }

    function getInitialMessage(){
        if(!props.isLoggedIn())
            return;
        const initialMessage = <div>
            <p>Hello {cookies['user']}</p>
            <p> I am here to help</p>
            <AvailableOptions 
                handleWeather = {()=>handleWeather()}
                handleJavascriptLinks = {()=>handleJavascriptLinks()}
                handleLoggedUser = {()=>handleLoggedUser()}
                handleTime ={()=>handleTime()}
             />
        </div>
        getResponse(initialMessage)
    }

    function greet(){
        getResponse(<p>Hello {cookies['user']}</p>);
    }

    function handleWeather(){
        console.log('W called')
        getResponse(<p>Weather is foggy today</p>);
    }

    function handleJavascriptLinks(){
        getResponse(<div>
            <p>Here are few resources to learn javascript:</p>
        <LinkList/>
        </div>)
    }

    function handleLoggedUser(){
        getResponse(<p>You are currently logged in as {cookies['user']}</p>)
    }

    function handleTime(){
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;

        getResponse(<p>Date & Time: {dateTime}</p>)
    }

    function handleUnhandledMessage(){
        getResponse(<p>Could not understand your request</p>)
    }


    return props.isLoggedIn() && <div>
        <div className='message-area'>
                {messages.map((message,index)=>{
                    return <div key={index}>{message}</div>
                })}

        </div>
        <div className='input-area'>
        <input type='text' value={message} onChange={(event)=>setMessage(event.target.value)}></input>
        <button onClick={()=>onSend()}>Send</button>
        </div>
    </div>
}

export default ChatBot;