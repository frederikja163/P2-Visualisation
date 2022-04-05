/// <reference lib="dom" />

// Setting up all variables.
let currentPromise: Promise<void>;
let resolveCurrentPromise: Function;

let codeFunction:Function | null = null;
let stopRunning: boolean = false;
let awaitingPromise: boolean = false;

/** stoping the current running of code by resolving all promises*/
function stopCode(): void{
	if(codeFunction != null) {
		stopRunning = true
		if(awaitingPromise){
			resolveCurrentPromise();
		}
	}
}

/** Gets the breakable code and runs the code until the first breakpoint.*/
async function runCode(): Promise<void>{
	
	// Setting up promises.
	currentPromise = new Promise((resolve:Function, reject:Function) => { 
		resolveCurrentPromise = resolve; 
	});

	// Running function.
	if(codeFunction != null) {
		stopRunning = false;
		await codeFunction();
		stopRunning = false;
	}
}

/** Runs the code untill the next breakpoint by setting up promises. */
function next():void{
	resolveCurrentPromise();
}

/** This function gets all lines of code, adds breakpoints, and returns this as a function. */
function parseCode(): void{

	removeAllHighligting();
	stopCode();

	let code: string = "";

	// Getting a list of all lines of code. 
    const lines: NodeListOf<HTMLSpanElement> = <NodeListOf<HTMLSpanElement>>document.getElementById("code")?.querySelectorAll("span");

	// Adding each line of code to the code string.
	for (let i: number = 0; i < lines.length; i++){
		
		// Inserting the current line, but adding async in front of any function.
		let currentLine: string = lines[i].innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');

		currentLine = addAsync(currentLine);
		currentLine = addBreakpoint(currentLine, lines, i); 

		code += currentLine + "\n"
    }

	// Creating a function from the string.
	codeFunction = new Function('return ' + code)();

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

/** Adds breakpoint to the current line if a control structure is found.*/
function addBreakpoint(currentLine: string, lines: NodeListOf<HTMLSpanElement>, lineNum: number):string{
	
	// If is given the last line, then do nothing with the line.
	if(lineNum == lines.length - 1) {
		return currentLine;
	}

	// Checking if the current line has a breakpoint, if so add it.
	if (!(lines[lineNum].classList.contains(breakpointClass))){
		return currentLine;
	} 

	// Checks if line has While, for, if, else, switch or function
	let hasWhile: boolean = currentLine.includes("while"); 		//in
	let hasFor: boolean = currentLine.includes("for"); 			//in
	let hasIf: boolean = currentLine.includes("if"); 			//in
	let hasElse: boolean = currentLine.includes("else"); 		//after
	let hasFunction: boolean = currentLine.includes("function");//after
	
	// Adding breakpoint.
	if(hasWhile || hasFor || hasIf){
		
		// Insert breakpoint in line.
		let indexOfExpr = hasFor ? currentLine.indexOf(";") : currentLine.indexOf("(");
		currentLine = currentLine.substring(0, indexOfExpr + 1) + `await debug(${lineNum}) && ` + currentLine.substring(indexOfExpr + 1, currentLine.length);

	}else if(hasElse || hasFunction){ 

		// Insert breakpoint after line.
		currentLine += `\nawait debug(${lineNum});`;
		
	}else{ 
		
		// Insert breakpoint before line.
		currentLine = `await debug(${lineNum});\n` + currentLine; 

	}
	
	return currentLine;
}

/** Waiting for a specific promise.*/
async function debug(line: number): Promise<boolean>{
	
	// Adding/removing highligting and waiting by using a promise.
	highLight(line);
	
	if(!stopRunning){
		awaitingPromise = true;
		await currentPromise;
		awaitingPromise = false;
	}

	removeHighLight(line);

	// Creating a new promise.
	currentPromise = new Promise((resolve:Function, reject:Function) => {
		resolveCurrentPromise = resolve; 
	});

	return true;
}
