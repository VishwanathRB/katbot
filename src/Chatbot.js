import React, { useEffect,useState } from 'react';
import {useCookies} from 'react-cookie';
import AvailableOptions from './AvailableOptions';
import LinkList from './LinkList';
import './Chatbot.css'
import loadingImage from './typing-loading.gif';

function ChatBot(props){
    const [disableSend,setDisableSend] = useState(false);
    const cookies = useCookies(['user'])[0];
    const [message,setMessage] = useState('');
    const [messages,setMessages] = useState([]);

    const  loading = <div className='response-style'><img src={loadingImage}></img></div>;
    useEffect(()=>{
        getInitialMessage();
    },[cookies])




    function getResponse(message) {
        setDisableSend(()=>true);
        console.log('getRees called')
        
        setMessages((messages)=>[...messages,loading]);
        setTimeout(() => {
            setMessages((messages)=>{
                removeLoading(messages);
                return [...messages,<div className='response-style'>{message}</div>]
            });
            setDisableSend(()=>false);
        },500);
    }

    function onSend(){
        setDisableSend(()=>true);
        const userMessage = <div className="request-style">
            {message}
        </div>
        setMessages((messages)=>[...messages,userMessage]);
        setMessage(()=>'')
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
        //if(lowerCaseMessage.includes('date') || lowerCaseMessage.includes('time')){
        if(checkIfContains(lowerCaseMessage,['date','time'])){
            handleTime();
            isHandled = true;
        }
        if(checkIfContains(lowerCaseMessage,['log','user','name'])){
            handleLoggedUser();
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
        getResponse(<p>You are currently logged in with username '{cookies['user']}'</p>)
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

    function checkIfContains(message, keywords) {
        let contains = false;
        keywords.map((keyword)=>{
            if(message.includes(keyword)){
                contains = true;
            }
        });
        return contains;
    }

    function removeLoading(messages){
        for(let i=0;i<messages.length;i++){
            if(messages[i] == loading){
                console.log(messages[i])
                messages.splice(i,1);
                break;
            }
        }
    }


    return props.isLoggedIn() && <div>
        <div className='message-area'>
                {messages.map((message,index)=>{
                    return <div key={index}>{message}</div>
                })}

        </div>
        <div className='input-area'>
        <input type='text' value={message} onChange={(event)=>setMessage(event.target.value)}></input>
        <button disabled={disableSend} onClick={()=>onSend()}>Send</button>
        </div>
    </div>
}

export default ChatBot;