import React from 'react';

const AvailableOptions = (props) => {
    const options = [
        { text: "Javascript", 
        handler: ()=>props.handleJavascriptLinks()
        , id: 1 },
        { text: "Weather", handler: ()=>props.handleWeather(), id: 2 },
        { text: "Logged In User", handler: () => props.handleLoggedUser(), id: 3 },
        { text: "Security", handler: () => {}, id: 4 },
    ]

    const optButtons = options.map((option)=>{
        return <button key={option.id} onClick={()=>option.handler()}>
            {option.text}
            </button>
    });

    return <div className="learning-options-container">{optButtons}</div>
}

export default AvailableOptions;