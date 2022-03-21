function highLight(index : number){
    let currParagraph = document.querySelector("p[index=\""+index+"\"]");
    currParagraph.classList.add("highlighted");
}

function removeHighLight(index : number){
    let currParagraph = document.querySelector("p[index=\""+index+"\"]");
    currParagraph.classList.remove("highlighted");
}