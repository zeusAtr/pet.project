document.getElementById("checkTransaction")?.addEventListener("click", () => {
    const txInput = (document.getElementById("txHashInput") as HTMLInputElement).value;
    if (txInput) {
        chrome.runtime.sendMessage({ action: "checkTransaction", txInput });
    }
});
