/// <reference lib="dom" />

// Setting up all variables.
let currentPromise: Promise<void>;
let resolveCurrentPromise: Function;

let codeFunction:Function | null = null;
let isStopping: boolean = false;
let awaitingPromise: boolean = false;
let isRunning: boolean = false;

/** Stopping the current running of code by resolving all promises*/
function stopCode(): void{
	
	if(codeFunction != null && isRunning && awaitingPromise) {
		isStopping = true;
		resolveCurrentPromise();
	}

	removeAllHighlighting();
	setButtonToRun();
}

/** Gets the breakable code and runs the code until the first breakpoint.*/
function runCode(): void{
	
	parseCode();
	
	// Setting up promises.
	currentPromise = new Promise((resolve:Function, reject:Function) => { 
		resolveCurrentPromise = resolve; 
	});

	// Running function.
	if(codeFunction != null) {
		isStopping = false;
		isRunning = true;
		setButtonToStop();
		codeFunction().then((resolve:Function, reject: Function) => {
			setButtonToRun();
			isRunning = false;
			isStopping = false;

			removeAllHighlighting();
		});
	}else{
		removeAllHighlighting();
	}

}

/** Setting the run button to be a stop button.*/
function setButtonToStop():void{
	const runButton: HTMLInputElement | null = <HTMLInputElement | null> document.getElementById("runStopButton");

	if(runButton != null){
		runButton.value = "Stop";
		runButton.onclick = stopCode;
	}
}

/** Setting the stop button to be a run button.*/
function setButtonToRun():void{
	const runButton: HTMLInputElement | null = <HTMLInputElement | null> document.getElementById("runStopButton");

	if(runButton != null){
		runButton.value = "Run";
		runButton.onclick = runCode;
	
	}
}

/** Runs the code untill the next breakpoint by setting up promises. */
function next():void{
	resolveCurrentPromise();
}

/** This function gets all lines of code, adds breakpoints, and returns this as a function. */
function parseCode(): void{

	stopCode();

	let code: string = "";

	// Getting a list of all lines of code. 
    const lines: NodeListOf<HTMLSpanElement> = <NodeListOf<HTMLSpanElement>>document.getElementById("code")?.querySelectorAll("span");

	// Adding each line of code to the code string.
	for (let i: number = 0; i < lines.length; i++){
		
		// Inserting the current line, but adding async in front of any function.
		let currentLine: string = lines[i].innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');

		currentLine = addAwait(currentLine, lines.length, i);
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

/** Adding await to the current line if the call of a function is found*/
function addAwait(currentLine: string, lineCount: number, lineNum: number):string{

	//if it is the second to last line and it contains "(" and ")"
	const hasStartBracket: boolean = currentLine.includes("(");
	const hasEndBracket: boolean = currentLine.includes(")");
	const hasStartCurleyBracket: boolean = currentLine.includes("{");
	const hasBeginCurleyBracket: boolean = currentLine.includes("}");

	if(hasStartBracket && hasEndBracket && !hasStartCurleyBracket && !hasBeginCurleyBracket){
		return "await " + currentLine;
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
	
	// Adding/removing highlighting and waiting by using a promise.
	if(!isStopping){
		awaitingPromise = true;
		highLight(line);
		await currentPromise;
		removeHighLight(line)
		awaitingPromise = false;
	}

	// Creating a new promise.
	currentPromise = new Promise((resolve:Function, reject:Function) => {
		resolveCurrentPromise = resolve; 
	});

	return true;
}
