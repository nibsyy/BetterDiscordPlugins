/**
 * @name HideServersFromActiveNow
 * @description Hides specific servers from the Active Now column
 * @version 1.0.0
 * @author nibsy
 * @authorId 251771217546182656
 * @source https://github.com/nibsyy/BetterDiscordPlugins/blob/main/HideServersFromActiveNow/HideServersFromActiveNow.js
 * @donate https://paypal.me/neebsie
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const config = {
    main: "index.js",
    id: "",
    name: "HideServersFromActiveNow",
    author: "nibsy",
    authorId: "251771217546182656",
    authorLink: "",
    version: "1.0.0",
    description: "Hides specific servers from the Active Now column",
    website: "",
    source: "https://github.com/nibsyy/BetterDiscordPlugins/blob/main/HideServersFromActiveNow/HideServersFromActiveNow.js",
    patreon: "",
    donate: "https://paypal.me/neebsie",
    invite: "",
    changelog: [],
    defaultConfig: []
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Library) => {

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
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/