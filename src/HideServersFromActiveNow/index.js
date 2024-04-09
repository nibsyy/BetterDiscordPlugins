/**
 * 
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Library 
 * @returns 
 */
module.exports = (Plugin, Library) => {

    const {Logger} = Library;
    
    return class HideServersFromActiveNow extends Plugin {
        
        onStart() {
            Logger.info("Plugin enabled!");
            this.hideVoiceChannels();
        }

        onStop() {
            Logger.info("Plugin disabled!");
            this.unhideVoiceChannels();
        }

        // Iterate through current voice channels, and hide if they're on the list
        hideVoiceChannels() {
            const serverNameToHide = "Cancer Gaming"; // Replace with the server name to hide

            // Select all voice channel elements
            const voiceChannels = document.getElementsByClassName("itemCard_b64118");
            for (let i = 0; i < voiceChannels.length; i++) {
                const channelElement = voiceChannels[i];
                const serverName = channelElement.querySelector(".voiceSectionDetails__00679 .voiceSectionText__406cb");

                if (serverName && serverName.textContent.toUpperCase() === serverNameToHide.toUpperCase()) {
                    // Hide the channel element
                    channelElement.style.display = "none"; // OR channelElement.parentNode.removeChild(channelElement);\
                    channelElement.classList.add("hidden-by-plugin");
                    console.log("Hiding " + serverNameToHide);
                }
            }
        }

        // Un-hide all voice channels that have been hidden
        unhideVoiceChannels() {
            const hiddenElements = document.querySelectorAll(".hidden-by-plugin");
            for (const hiddenElement of hiddenElements) {
                // Remove the hidden class and set display to normal
                hiddenElement.classList.remove("hidden-by-plugin");
                hiddenElement.style.display = "";
            }
            console.log("Unhiding all servers");
        }
    };
};