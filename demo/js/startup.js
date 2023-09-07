(() => {
  let ukeGeeks;

  /**
   * For demo purposes allows one to turn on/off the inlineDiagrams setting.
   */
  function checkUrlOpts() {
    const regEx = /[?&]inline=([^&]*)/i;
    const matches = (`${window.location}`).match(regEx);
    if (!matches || matches.length < 1) {
      return;
    }
    ukeGeeks.settings.inlineDiagrams = true;
  }

  /**
   * Here we've added a call to checkUrlOpts in what's otherwise a
   * very "standard" way to run Scriptasaurus.
   */
  function run() {
    ukeGeeks = window.ukeGeeks;
    checkUrlOpts();
    ukeGeeks.scriptasaurus.init(false);
    ukeGeeks.scriptasaurus.run();
  }

  setTimeout(run, 3000);
})();
