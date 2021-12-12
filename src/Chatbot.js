import React, { useEffect,useState,useRef } from 'react';
import {useCookies} from 'react-cookie';
import AvailableOptions from './AvailableOptions';
import LinkList from './LinkList';
import './Chatbot.css'
import loadingImage from './typing-loading.gif';


const scrollToRef = (ref) => {
    if(ref && ref.current){
        ref.current.scrollTop =ref.current.scrollHeight;
    }
}  

function ChatBot(props){
    const allKeywords = new Set(['hi','hello','javascript','js', 'weather', 'time', 'date', 'user', 'log', 'name']);
    const responseHandlers = [
        greet,
        handleJavascriptLinks,
        handleWeather,
        handleTime,
        handleLoggedUser,
        handleUnhandledMessage,
    ]
    const keywordsBuckets = [
        ['hi','hello'],
        ['js','javascript'],
        ['weather'],
        ['time','date'],
        ['user','name','log']
    ]

    const keywordsSets = keywordsBuckets.map((bucket)=>(new Set(bucket)))

    const [disableSend,setDisableSend] = useState(false);
    const cookies = useCookies(['user'])[0];
    const [message,setMessage] = useState('');
    const [messages,setMessages] = useState([]);

    const  loading = <div className='response-style'><img src={loadingImage}></img></div>;
    const myRef = useRef(null);
    useEffect(()=>{
        getInitialMessage();
    },[cookies])




    function getResponse(message) {
        setDisableSend(()=>true);
        console.log('getRees called')
        setMessages((messages)=>[...messages,loading]);
        scrollToRef(myRef);
        setTimeout(() => {
            setMessages((messages)=>{
                removeLoading(messages);
                return [...messages,<div className='response-style'><div>{message}</div></div>]
            });
            setDisableSend(()=>false);
            scrollToRef(myRef);
        },500);
    }

    function onSend(){
        if(message===''){
            return;
        }
        setDisableSend(()=>true);
        const userMessage = <div className="request-style"><div>
            <p>{message}</p>
        </div></div>
        setMessages((messages)=>[...messages,userMessage]);
        setMessage(()=>'')
        parseMessage(message);
        // getResponse(message);

    }

    function parseMessage(message){
        const lowerCaseMessage = message.toLowerCase();
        const tokens = lowerCaseMessage.split(' ');
        let keyword = '';
        for(let i=0; i<tokens.length; i++){
            if(allKeywords.has(tokens[i])){
                keyword  = tokens[i];
                break;
            }
        }
        if(keyword === ''){
            handleUnhandledMessage();
        } else{
            for(let i=0; i<keywordsSets.length; i++){
                if(keywordsSets[i].has(keyword)){
                    responseHandlers[i]();
                    break;
                }
            }
        }
        
    }

    function getInitialMessage(){
        if(!props.isLoggedIn())
            return;
        const initialMessage = <div>
            <p>Hello {cookies['user']},</p>
            <p> I am here to help.</p>
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
        getResponse(
        <div>
            <p>Could not understand your request.</p>
            <p>You can ask regarding following topics:</p>
            <AvailableOptions 
                handleWeather = {()=>handleWeather()}
                handleJavascriptLinks = {()=>handleJavascriptLinks()}
                handleLoggedUser = {()=>handleLoggedUser()}
                handleTime ={()=>handleTime()}
             />
        </div>)
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
        <div className='message-area' ref={myRef}>
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