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
	
	if(isRunning) {
		isStopping = true;
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
	const functionNames: string[] = getFunctionNames(lines);

	// Adding each line of code to the code string.
	for (let i: number = 0; i < lines.length; i++){
		
		// Inserting the current line, but adding async in front of any function.
		let currentLine: string = lines[i].innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');

		currentLine = addAsyncAwait(currentLine, functionNames);
		currentLine = addBreakpoint(currentLine, lines, i); 

		code += currentLine + "\n"
    }

	// Creating a function from the string.
	codeFunction = new Function('return ' + code)();
}

/** Getting the names of all of the functions declared in codeFunction*/
function getFunctionNames(lines: NodeListOf<HTMLSpanElement>): string[]{
	const functionNames: string[] = [];

	for(let i = 0; i < lines.length; i++){
		const currentLine: string = lines[i].innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
		const indexOfFunction: number = currentLine.indexOf("function");
		
		if(indexOfFunction != -1){
			functionNames.push(currentLine.substring(indexOfFunction + "function".length + 1, currentLine.indexOf("(")));
		}
	}
	
	return functionNames;
}

/** Adds async to the current line if a function is found.*/
function addAsyncAwait(currentLine: string, functionNames: string[]):string{
	
	// Getting index of function and adding async in front of it.
	const indexOfFunction: number = currentLine.indexOf("function");
		
	if(indexOfFunction != -1){
		return currentLine.substring(0, indexOfFunction) + "async " + currentLine.substring(indexOfFunction, currentLine.length);
	}else{
		
		//finds the name of the function on the current line
		for(let i:number = 0; i < functionNames.length; i++){
			const indexOfFunction: number = currentLine.indexOf(functionNames[i]);
		
			if(indexOfFunction != -1){
				return currentLine.substring(0, indexOfFunction) + "await " + currentLine.substring(indexOfFunction, currentLine.length);
			}
		}

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
	const hasWhile: boolean = currentLine.includes("while"); 		//in
	const hasFor: boolean = currentLine.includes("for"); 			//in
	const hasIf: boolean = currentLine.includes("if"); 			//in
	const hasElse: boolean = currentLine.includes("else"); 		//after
	const hasFunction: boolean = currentLine.includes("function");//after
	
	// Adding breakpoint.
	if(hasWhile || hasFor || hasIf){
		
		// Insert breakpoint in line.
		const indexOfExpr = hasFor ? currentLine.indexOf(";") : currentLine.indexOf("(");
		currentLine = currentLine.substring(0, indexOfExpr + 1) + `await breakpoint(${lineNum}) && ` + currentLine.substring(indexOfExpr + 1, currentLine.length);

	}else if(hasElse || hasFunction){ 

		// Insert breakpoint after line.
		currentLine += `\nawait breakpoint(${lineNum});`;
		
	}else{ 
		
		// Insert breakpoint before line.
		currentLine = `await breakpoint(${lineNum});\n` + currentLine; 

	}
	
	return currentLine;
}

/** Waiting for a specific promise.*/
async function breakpoint(line: number): Promise<boolean>{
	
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
