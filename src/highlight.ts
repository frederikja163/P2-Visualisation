function highLight(index : number) : void{
    let currParagraph = document.querySelector("p[index=\""+index+"\"]");
    if(currParagraph != null) currParagraph.classList.add("highlighted");
}

function removeHighLight(index : number) : void{
    let currParagraph = document.querySelector("p[index=\""+index+"\"]");
    if(currParagraph != null) currParagraph.classList.remove("highlighted");
}