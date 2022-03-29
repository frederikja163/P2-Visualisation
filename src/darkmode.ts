function darkMode() : void{
    const bodyElement = document.body;
    const textBoxElement = document.querySelectorAll(".textbox");
    const darkModeBtn = document.querySelector("#darkModeBtn") as HTMLInputElement;
    const rightTextBox = document.querySelector("#right");

    rightTextBox.classList.toggle("dark-mode");
    bodyElement.classList.toggle("dark-mode");
    for(let element of textBoxElement){
        element.classList.toggle("dark-mode");
    }

    bodyElement.classList.contains("dark-mode") ?   darkModeBtn.value="Light Mode" : 
                                                    darkModeBtn.value="Dark Mode";

 }