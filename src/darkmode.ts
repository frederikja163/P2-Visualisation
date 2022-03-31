function darkMode() : void{
    const bodyElement = document.body;
    const darkModeBtn = document.querySelector("#darkModeBtn") as HTMLInputElement;

    bodyElement.classList.toggle("dark-mode");

    bodyElement.classList.contains("dark-mode") ?   darkModeBtn.value="Light Mode" : 
                                                    darkModeBtn.value="Dark Mode";

 }