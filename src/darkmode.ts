/*
This file includes the function darkMode which changes the visual color of the site between light and dark colors.
*/

/**Toggles darkmode.*/
function darkMode(): void {
    const bodyElement: HTMLElement = document.body;
    const darkModeBtn: HTMLInputElement = <HTMLInputElement>document.querySelector("#darkModeBtn");

    bodyElement.classList.toggle("dark-mode");
    darkModeBtn.value = bodyElement.classList.contains("dark-mode") ? "Light Mode" :
        "Dark Mode";
}