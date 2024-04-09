/**
 * 
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Library 
 * @returns 
 */
module.exports = (Plugin, Library) => {
    const fs = require("fs");
    const {Logger} = Library;
    
    return class HideServersFromActiveNow extends Plugin {
        onStart() {
            // Hide channels on plugin load
            this.hideActiveNowElements();

            // Hide channels when something on the list changes
            const activeNowContainer = document.querySelector('.scroller__7c25e');
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        Logger.info("Change in list detected, attempting to hide new channels...");
                        this.hideActiveNowElements();
                        break;
                    }
                }
            })
            observer.observe(activeNowContainer, { childList: true});
        }

        onStop() {
            this.unhideActiveNowElements();
        }

        getSettingsPanel() {
            return this.buildSettingsPanel().getElement();
        }

        // Iterate through items on the list, and hide if they have to be hidden
        hideActiveNowElements() {
            const serversToHide = this.settings.categoryservers.hideservernames.split(";").map(item => item.trim());

            // Select all voice channel elements
            const voiceChannels = document.getElementsByClassName("itemCard_b64118");
            for (let i = 0; i < voiceChannels.length; i++) {
                const channelElement = voiceChannels[i];
                const serverName = channelElement.querySelector(".voiceSectionDetails__00679 .voiceSectionText__406cb");

                serversToHide.forEach(serverToHide => {
                    if (serverName && serverName.textContent.toUpperCase() === serverToHide.toUpperCase()) {
                        // Hide the channel element
                        channelElement.style.display = "none"; // OR channelElement.parentNode.removeChild(channelElement);\
                        channelElement.classList.add("hidden-by-plugin");
                        Logger.info("Hiding " + serverToHide);
                    }
                });
            }
        }

        // Un-hide everything that has been hidden
        unhideActiveNowElements() {
            const hiddenElements = document.querySelectorAll(".hidden-by-plugin");
            for (const hiddenElement of hiddenElements) {
                // Remove the hidden class and set display to normal
                hiddenElement.classList.remove("hidden-by-plugin");
                hiddenElement.style.display = "";
            }
            Logger.info("Unhiding all servers");
        }
    };
};