/// <reference lib="dom" />

// Setting up all variables.
let currentPromise: Promise<void>;
let resolveCurrentPromise: Function;

/** Gets the breakable code and runs the code untill the first breakpoint.*/
function runCode(){
	
	// Getting the amount of lines.
	const lineCount: number = document.querySelectorAll("p").length;

	// Removes all highligts.
	for (let i: number = 0; i < lineCount; i++){
		removeHighLight(i);
	}

	// Setting up promises.
	currentPromise = new Promise((resolve:Function, reject:Function) => {
		resolveCurrentPromise = resolve; 
	});

	// Running function.
	createBreakableCode()();
}

/** Runs the code untill the next breakpoint by setting up promises. */
function next(){
	resolveCurrentPromise();
}

/** This function gets all lines of code, adding breakpoints, and returns this as a function. */
function createBreakableCode(): Function{

	let code: string = "";

	// Getting a list of all lines of code.
    const lines: NodeListOf<HTMLParagraphElement> = document.querySelectorAll("p");

	// Adding each line of code to the code string.
	for (let i: number = 0; i < lines.length; i++){
		
		// Inserting the current line, but adding async in front of any function.
		let currentLine: string = lines[i].innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');

		currentLine = addAsync(currentLine);
		currentLine = addBreakpoint(currentLine, lines, i);
        
		code += currentLine + "\n"
    }

	// Creating a function from the string.
	return new Function('return ' + code)();

}

/** Adds async to the current line if a function is found.*/
function addAsync(currentLine: string):string{
	
	// Getting index of function and adding async in front of it.
	let indexOfFunction: number = currentLine.indexOf("function");
		
	if(indexOfFunction != -1){
		return currentLine.substring(0, indexOfFunction) + "async " + currentLine.substring(indexOfFunction, currentLine.length);
	}
	
	return currentLine;
}

function addBreakpoint(currentLine: string, lines: NodeListOf<HTMLParagraphElement>, lineNum: number):string{
	
	// If is given the last line, then do nothing with the line.
	if(lineNum != lines.length - 1) {
		return currentLine;
	}
	
	// Remove the breakpoint if it already exists, otherwise add a breakpoint.
	if (lines[lineNum].classList.contains(breakpointClass)){

		// Getting index of {Do, while, for, if, else (after), switch}
		let indexOfDo: number = currentLine.indexOf("do"); 			//before
		let indexOfWhile: number = currentLine.indexOf("while"); 	//in
		let indexOfFor: number = currentLine.indexOf("for"); 		//in
		let indexOfIf: number = currentLine.indexOf("if"); 			//in
		let indexOfSwitch: number = currentLine.indexOf("switch"); 	//before
		
		// Adding breakpoint.
		if(indexOfDo != -1 || indexOfSwitch != -1){ 

			// Insert breakpoint before line.
			currentLine = "await debug(" + lineNum + ");\n" + currentLine;

		}else if(indexOfWhile != -1 || indexOfFor != -1 || indexOfIf != -1){
			
			// Insert breakpoint in line.
			let indexOfExpr = indexOfFor != -1 ? currentLine.indexOf(";") : currentLine.indexOf("(");
			currentLine = currentLine.substring(0, indexOfExpr + 1) + "await debug(" + lineNum + ") && " + currentLine.substring(indexOfExpr + 1, currentLine.length);

		}else{ 
			
			// Insert breakpoint after line.
			currentLine += "\nawait debug(" + lineNum + ");";
		}

	} 
		
	return currentLine;
}

/** Waiting for a specific promise.*/
async function debug(line: number): Promise<boolean>{
	
	// Adding/removing highligting and waiting by using a promise.
	highLight(line);
	
	await currentPromise;

	removeHighLight(line);

	// Creating a new promise.
	currentPromise = new Promise((resolve:Function, reject:Function) => {
		resolveCurrentPromise = resolve; 
	});

	return true;
}
