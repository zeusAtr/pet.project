const checkBtn = document.getElementById('checkBtn') as HTMLButtonElement;
const txInput = document.getElementById('txInput') as HTMLTextAreaElement;
const result = document.getElementById('result') as HTMLElement;
const txType = document.getElementById('txType') as HTMLElement;

checkBtn.addEventListener('click', () => {
    console.log("Button clicked");
    const tx = txInput.value;
    const parsed = JSON.parse(tx);
    const msg = parsed?.body?.messages?.[0] || parsed?.txBody?.messages?.[0];
    const msgs = parsed?.msgs;
    const type = msg?.['@type'] || msg?.typeUrl || msgs?.type;

    try {
        const address = msg?.delegator_address || msg?.value?.delegator_address;
        const recipient = msg?.value?.recipient || msg?.value?.to_address || msg?.value?.sender; // Добавляем поле для получателя
        const sender = msg?.value?.sender || msg?.value?.from_address; // Добавляем поле для отправителя
        const contractAddress = msg?.value?.contract; // Добавляем поле для адреса контракта, если оно есть
        const memo = msg?.value?.memo || ""; // Добавляем поле для мемо
        const knownRiskyAddresses = [
            ''
        ];

        if (type?.includes("MsgGrant") || type?.includes("MsgExec")) {
            result.innerHTML = `<div class='danger'>⚠️ AUTHZ DETECTED: ${type}<br>Make sure you're not giving permission to control your funds.</div>`;
        }
        else if (type?.includes("MsgSend")) {
            if (knownRiskyAddresses.includes(recipient)) {
                result.innerHTML = `<div class='danger'>⚠️ Risky recipient detected: ${recipient}</div>`;
            } else {
                result.innerHTML = `<div class='warning'>💸 Send detected to: ${recipient}</div>`;
            }
        }
        else if (msg.typeUrl?.includes("MsgTransfer") && msg.value?.memo?.includes("wasm")) {
            result.innerHTML = `<div class='warning'>⚠️ Complicated IBC with wasm-redirect. Attention!</div>`;
        }
        else if (type?.includes("MsgDelegate")) {
            result.innerHTML = `<div class='warning'>⚠️ Delegation detected to: ${address}</div>`;
        }
        else if (type?.includes("MsgUndelegate")) {
            result.innerHTML = `<div class='warning'>⚠️ Undelegation detected from: ${address}</div>`;
        }
        else if (type?.includes("MsgBeginRedelegate")) {
            result.innerHTML = `<div class='warning'>⚠️ Redelegation detected from: ${address}</div>`;
        }
        else if (contractAddress) {
            result.innerHTML = `<div class='warning'>⚠️ Contract interaction detected: ${contractAddress}</div>`;
        }
        else if (knownRiskyAddresses.includes(sender)) {
            result.innerHTML = `<div class='danger'>⚠️ Risky sender detected: ${sender}</div>`;
        }
        else if (memo?.includes("suspicious")) {
            result.innerHTML = `<div class='danger'>⚠️ Suspicious memo detected: ${memo}</div>`;
        }
        else {
            result.innerHTML = `<div class='safe'>✅ Transaction looks normal:<br>${type}</div>`;
        }
    } catch (e) {
        result.innerText = "❌ Failed to parse transaction.";
    }

    txType.innerHTML = `<div> Type: <b>${type}</b> </div>>`;
});
