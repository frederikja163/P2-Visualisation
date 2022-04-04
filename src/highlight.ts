function highLight(index : number) : void{
    let currParagraph = document.querySelector("span[index=\""+index+"\"]");
    if(currParagraph != null) currParagraph.classList.add("highlighted");
}

function removeHighLight(index : number) : void{
    let currParagraph = document.querySelector("span[index=\""+index+"\"]");
    if(currParagraph != null) currParagraph.classList.remove("highlighted");
}

function removeAllHighligting(){
    
	// Removes all highligts.
	const lineCount: number = <number> document.getElementById("code")?.querySelectorAll("span")?.length;

	for (let i: number = 0; i < lineCount; i++){
		removeHighLight(i);
	}

}