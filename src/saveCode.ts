
const colonIndicator = "<$SEMICOLON$>"
const newlineIndicator = "<$NEWLINE$>"

const codeVarName = "codeString";
const pseuVarName = "pseudocodeString"


/** Saves the code and pseudocode in the cookie.*/
function saveCodeToCookie (): void {
	
	// Get html code and pseudocode.
    const codeElement: HTMLElement | null = document.getElementById('left');
	if(codeElement == null) return;
	const codeString: string = codeElement.innerHTML;

    const pseudocodeElement: HTMLInputElement | null = <HTMLInputElement>document.getElementById('righttextbox');
    if(pseudocodeElement == null) return;
    const pseudocodeString: string = pseudocodeElement.value; 

	// Give code and pseudocode to cookie.
	setCookieVariable(codeVarName, codeString);
	setCookieVariable(pseuVarName, pseudocodeString); 
}

/** Takes the code and pseudocode from the cookie and implements it in the HTML code.*/
function addCodeFromCookie (): void {

    // Get cookie and split into code and pseudocode.
	const codeString: string = getCookieVariable(codeVarName);
	const pseudocodeString: string = getCookieVariable(pseuVarName);

	if(codeString === "" || pseudocodeString === "") return;

	// Add code and pseudocode to html.
    const codeElement: HTMLElement | null = document.getElementById('left');
	if(codeElement == null) return;
	codeElement.innerHTML = codeString;

    const pseudocodeElement: HTMLInputElement | null = <HTMLInputElement>document.getElementById('righttextbox');
    if(pseudocodeElement == null) return;
    pseudocodeElement.value = pseudocodeString;

}

/** Adding string to cookie variable.*/
function setCookieVariable(variableName:string, value: string): void{
	document.cookie = variableName + `=` + value.replaceAll(";", colonIndicator).replaceAll("\n", newlineIndicator) + `;`;
}

/** Getting string from cookie variable*/
function getCookieVariable(variableName:string): string{
	// Getting position of variable name.
	const cookieInfo: string = document.cookie;
	const variableIndex: number = cookieInfo.indexOf(variableName);

	if(variableIndex == -1) return "";

	// Getting position of variable value.
	const valueIndex: number = variableIndex + variableName.length + 1;

	// Getting length of variable value.
	let valueEndIndex: number = cookieInfo.substring(valueIndex, cookieInfo.length).indexOf(";") + valueIndex;

	if(valueEndIndex == valueIndex - 1) valueEndIndex = cookieInfo.length;

	// Getting variable value.
	return cookieInfo.substring(valueIndex, valueEndIndex).replaceAll(colonIndicator, ";").replaceAll(newlineIndicator, "\n"); 
}
