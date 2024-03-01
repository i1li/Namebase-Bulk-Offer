(function () {
    let inputOverlay = document.createElement("div");
    inputOverlay.innerHTML = `<div id="overlay" style="position: fixed; background-color: rgba(0,0,0,.9); top: 0; bottom: 0; left: 0; right: 0; z-index: 999; height:100wh; color: white; font-size: 2em; margin: auto; padding: auto; padding-top:1em;">
        <div id="container" style="background: rgba(0,0,0,.5); color: white; width: 90vw; height: 90vh; padding: 1em; border-radius: .5em; margin: auto; align-items: center;">
            <div>
                <label><span style="display:flex;">Default Offer Price</span><input type="number" id="price" value="1"></label>
            </div>
            <div>
                <label><span style="display:flex;">Names</span><textarea id="input" style="width:100%; height: 50vh;"></textarea></label>
            </div>
            <div style="margin-top:.5em;">
                <button id="cancel">Cancel</button>
                <button id="submit">Submit</button>
            </div>
        </div>
    </div>`;
    document.body.appendChild(inputOverlay);
    let priceInput = document.getElementById("price");
    let input = document.getElementById("input");
    let cancel = document.getElementById("cancel");
    let submit = document.getElementById("submit");
    cancel.onclick = () => inputOverlay.remove();
    submit.onclick = () => processOffers();
    function processOffers() {
        let price = parseFloat(priceInput.value) || 0;
        let offers = input.value.replace(/\r/g, "").split("\n").map(line => {
            line = line.toLowerCase().replace(/\([^)]*\)/g, "");
            if (line.startsWith("https://www.namebase.io/domains/")) {
                line = line.substring("https://www.namebase.io/domains/".length);
            }
            if (line.startsWith("counteroffer for")) {
                line = line.substring("counteroffer for".length);
            }
            if (line.endsWith(".eml")) {
                line = line.substring(0, line.length - ".eml".length);
            }
            if (line.endsWith("is now available for purchase")) {
                line = line.substring(0, line.length - "is now available for purchase".length);
            }
            const excludedValues = ["hns", "buy now", "filters", "accepts offers", "min price", "max price", "min length", "max length", "starts with", "ends with", "prev", "next", "dashboard", "marketplace", "auctions", "support", "all", "for sale", "sold", "search for domains", "sort by", "newly listed", "bulk search", "price", "26k", "29k", "domain"];
            const containsValues = [" hns", "exclude "];
            if (!line || line.length <= 2 || excludedValues.some(value => line === value) || containsValues.some(value => line.includes(value))) {                
                return null;
            }
            let [name, amount] = line.includes(",") ? line.split(",") : [line.trim(), price];
            line = line.trim();
            return { name: (name), amount: parseFloat(amount), sent: false };
        }).filter(Boolean);
        inputOverlay.remove();
        let loadingOverlay = document.createElement("div");
        loadingOverlay.innerHTML = `<div id="overlay" style="position: fixed; background-color: rgba(0,0,0,.9); top: 0; bottom: 0; left: 0; right: 0; z-index: 999; height:100wh; justify-content: center; align-items: center; color: white; font-size: 2em;">
        <div id="container" style="background: rgba(0,0,0,.6); color: white; width: 90vw; height: 90vh; padding: 1em; border-radius: .5em; margin: auto; text-align: center; padding-top:33vh;">
        <div>🤝Handshake=Root🫚</div>
        <div id="current-name"></div>
        <div id="progress">0.00%</div>
        <button id="cancel">Cancel</button></div></div>`;
        document.body.appendChild(loadingOverlay);
        let cancel = document.getElementById("cancel");
        cancel.onclick = () => loadingOverlay.remove()
        let batchSize = 10;
        let currentIndex = 0;
        let delayBetweenBatches = 1000 / 3;
        let unsuccessfulNames = [];
        async function processBatch() {
            let batch = offers.slice(currentIndex, currentIndex + batchSize);
            let promises = [];
            for (let offer of batch) {
                if (!offer.sent) {
                    document.getElementById("current-name").innerText = "Sending: " + offer.name;
                    let promise = sendOffer(offer.name, offer.amount)
                        .then(() => offer.sent = true)
                        .catch(() => unsuccessfulNames.push(offer.name));
                    promises.push(promise);
                }
            }
            await Promise.all(promises);
            currentIndex += batchSize;
            let progress = (currentIndex / offers.length * 100).toFixed(2);
            document.getElementById("progress").innerText = progress + "%";
            if (currentIndex < offers.length) {
                setTimeout(processBatch, delayBetweenBatches);
            } else {
                loadingOverlay.remove();
                if (unsuccessfulNames.length > 0) {
                    let errorNames = unsuccessfulNames.join(", ");
                    alert("Error submitting offers for names: " + errorNames);
                }
            }
        }
        processBatch();
    }
    function sendOffer(name, amount) {
        return fetch("https://www.namebase.io/api/v0/marketplace/" + name + "/bid", {
            credentials: "include",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: '{"buyOfferAmount":"' + amount + '"}',
            method: "POST"
        });
    }
})();
