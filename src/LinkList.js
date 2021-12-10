import React from 'react';

const LinkList = (props) => {
    const options= [
        {
          id: 1,
          text: 'Introduction to JS',
          url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/basic-javascript/',
        },
        {
         text: "Mozilla JS Guide",
         url:
           "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
         id: 2,
       },
       {
         text: "Frontend Masters",
         url: "https://frontendmasters.com",
         id: 3,
       },
     ]
    const lineMarkUp = options.map((link)=>{
        return <li key = {link.id}>  
        <a 
        href={link.url}
        target='_blank'
        rel= "noopener noreferrer"
        >{link.text}</a>
        </li>
    });
    

    return <ul>{lineMarkUp}</ul>
}

export default LinkList;