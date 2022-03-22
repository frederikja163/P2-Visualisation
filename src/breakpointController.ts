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
		let indexOfFunction: number = currentLine.indexOf("function");
		
		if(indexOfFunction != -1){
			code += currentLine.substring(0, indexOfFunction) + "async " + currentLine.substring(indexOfFunction, currentLine.length) + "\n";
		}else{
			code += currentLine + "\n";
		}

        // Remove the breakpoint if it already exists, otherwise add a breakpoint.
		if (lines[i].classList.contains(breakpointClass)) 
			code += "await debug();\n";

    }

	//creating a function from the string
	return new Function('return ' + code)();

}

/** Waiting for a specific promise */
async function debug(): Promise<void>{
	await currentPromise;

	//creating a promise
	currentPromise = new Promise((resolve:Function, reject:Function) => {
		resolveCurrentPromise = resolve; 
	});
}
