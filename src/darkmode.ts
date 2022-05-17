function darkMode(): void {
    const bodyElement: HTMLElement = document.body;
    const darkModeBtn: HTMLInputElement = <HTMLInputElement>document.querySelector("#darkModeBtn");

    bodyElement.classList.toggle("dark-mode");
    darkModeBtn.value = bodyElement.classList.contains("dark-mode") ? "Light Mode" :
        "Dark Mode";
}