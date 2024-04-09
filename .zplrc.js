// .zplrc.js
module.exports = name => ({
    base: "./src",
    out: "./Release" + name,
    copyToBD: true,
    addInstallScript: true
});