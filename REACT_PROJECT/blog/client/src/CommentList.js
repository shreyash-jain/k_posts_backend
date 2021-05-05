import React from 'react';



export default ({ comments}) => {

   


    

    const renderedComments = Object.values(comments).map(comment => {
        let content= comment.content;

        if (comment.status == "failed") content = "This comment has been rejected";
        return <li key={comment.id}>{content}</li>
        
        ;
    });


    return <ul>
        {renderedComments}
    </ul>

};