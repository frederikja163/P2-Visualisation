
window.onload = main;

function main(): void
{
    addEventListener("beforeunload", saveCodeToCookie);
    addCodeFromCookie();
}
