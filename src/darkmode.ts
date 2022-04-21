function darkMode() : void{
    const bodyElement = document.body;
    const darkModeBtn = document.querySelector("#darkModeBtn") as HTMLInputElement;
    
    bodyElement.classList.toggle("dark-mode");
    darkModeBtn.value = bodyElement.classList.contains("dark-mode") ?   "Light Mode" : 
                                                                        "Dark Mode";
}