import './App.css';
import {useCookies} from 'react-cookie'; 
import ChatBot from './Chatbot';
import LoginPage from './LoginPage';

function App() {
  const [cookies,setCookies] = useCookies(['user']);

  const addCookie=(user)=>{
    setCookies('user', user, {path:'/'});
  }

  function checkIfLoggedIn(){
    if(cookies['user'] && cookies['user'] !== ''){
      return true;
    }
    return false;
  }

  return  <> 
    <LoginPage addCookie={addCookie} isLoggedIn={checkIfLoggedIn}/>
    <ChatBot isLoggedIn={checkIfLoggedIn}></ChatBot>
  </>
}

export default App;
