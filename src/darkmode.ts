function darkMode() : void{
    const bodyElement = document.body;
    const darkModeBtn = document.querySelector("#darkModeBtn") as HTMLInputElement;
    const rightTextBox = document.querySelector("#righttextbox");
    const dropdownContent = document.querySelector(".dropdown-content");

    rightTextBox.classList.toggle("dark-mode");
    bodyElement.classList.toggle("dark-mode");
    dropdownContent.classList.toggle("dark-mode");

    bodyElement.classList.contains("dark-mode") ?   darkModeBtn.value="Light Mode" : 
                                                    darkModeBtn.value="Dark Mode ";

 }