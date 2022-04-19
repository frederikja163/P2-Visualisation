function highLight(index : number) : void {
    const codeSpans: NodeListOf<Element> = document.querySelectorAll(`span[index=\"${index}\"]`);
    for (let i: number = 0; i < codeSpans.length; i++) {
        codeSpans[i].classList.add("highlighted");
    }
}

function removeHighLight(index : number) : void{
    const codeSpans: NodeListOf<Element> = document.querySelectorAll(`span[index=\"${index}\"]`);
    for (let i: number = 0; i < codeSpans.length; i++) {
        codeSpans[i].classList.remove("highlighted");
    }
}

function removeAllHighlighting(){
    
	// Removes all highligts.
	const lineCount: number = <number> document.getElementById("code")?.querySelectorAll("span")?.length;

	for (let i: number = 0; i < lineCount; i++){
		removeHighLight(i);
	}

}