function highLight(index : number) : void{
    let currParagraph = document.querySelector("p[index=\""+index+"\"]");
    currParagraph.classList.add("highlighted");
}

function removeHighLight(index : number) : void{
    let currParagraph = document.querySelector("p[index=\""+index+"\"]");
    currParagraph.classList.remove("highlighted");
}