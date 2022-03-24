/// <reference lib="dom" />

// - opbygning
// - breakpoints
// - insættelse af breakpoints
// - kørselsfunktioner

//setting up all variables
let currentPromise: Promise<void>;
let resolveCurrentPromise: Function;

/** Gets the breakable code and runs the code untill the first breakpoint*/
function runCode(){
	
	//removes all highligt
	//getting a list of all lines of code
	const lineCount: number = document.querySelectorAll("p").length;

	//Adding each line of code to the code string
	for (let i: number = 0; i < lineCount; i++){
		removeHighLight(i);
	}


	//setting up promises
	currentPromise = new Promise((resolve:Function, reject:Function) => {
		resolveCurrentPromise = resolve; 
	});

	//running function
	createBreakableCode()();
}

/** Runs the code untill the next breakpoint by setting up promises*/
function next(){
	resolveCurrentPromise();
}

/** This function gets all lines of code, adding breakpoints, and returns this as a function. */
function createBreakableCode(): Function{

	let code: string = "";

	//getting a list of all lines of code
    const lines: NodeListOf<HTMLParagraphElement> = document.querySelectorAll("p");

	//Adding each line of code to the code string
	for (let i: number = 0; i < lines.length; i++){
		
		//inserting the current line, but adding async in front of any function
		let currentLine: string = lines[i].innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');

		currentLine = addAsync(currentLine);
		if(i != lines.length - 1) currentLine = addBreakpoint(currentLine, lines, i);
        
		code += currentLine + "\n"
    }

	//creating a function from the string
	return new Function('return ' + code)();

}

/** Adds async to the current line if a function is found.*/
function addAsync(currentLine: string):string{
	let indexOfFunction: number = currentLine.indexOf("function");
		
	if(indexOfFunction != -1){
		return currentLine.substring(0, indexOfFunction) + "async " + currentLine.substring(indexOfFunction, currentLine.length);
	}
	
	return currentLine;
}

function addBreakpoint(currentLine: string, lines: NodeListOf<HTMLParagraphElement>, lineNum: number):string{
	// Remove the breakpoint if it already exists, otherwise add a breakpoint.
	if (lines[lineNum].classList.contains(breakpointClass)){

		//do, while, for, if, else (after), switch
		let indexOfDo: number = currentLine.indexOf("do"); 			//before
		let indexOfWhile: number = currentLine.indexOf("while"); 	//in
		let indexOfFor: number = currentLine.indexOf("for"); 		//in
		let indexOfIf: number = currentLine.indexOf("if"); 			//in
		let indexOfSwitch: number = currentLine.indexOf("switch"); 	//before
		
		//adding breakpoint
		if(indexOfDo != -1 || indexOfSwitch != -1){ 

			//insert breakpoint before line
			currentLine = "await debug(" + lineNum + ");\n" + currentLine;

		}else if(indexOfWhile != -1 || indexOfFor != -1 || indexOfIf != -1){
			
			//insert breakpoint in line
			let indexOfExpr = indexOfFor != -1 ? currentLine.indexOf(";") : currentLine.indexOf("(");
			currentLine = currentLine.substring(0, indexOfExpr + 1) + "await debug(" + lineNum + ") && " + currentLine.substring(indexOfExpr + 1, currentLine.length);

		}else{ 
			
			//insert breakpoint after line
			currentLine += "\nawait debug(" + lineNum + ");";
		}

	} 
		
	return currentLine;
}

/** Waiting for a specific promise */
async function debug(line: number): Promise<boolean>{
	
	highLight(line);
	
	await currentPromise;

	removeHighLight(line);

	//creating a promise
	currentPromise = new Promise((resolve:Function, reject:Function) => {
		resolveCurrentPromise = resolve; 
	});

	return true;
}
