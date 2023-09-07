(() => {
  let ukeGeeks;
  // const { ukeGeeks } = window;
  /**
   * For demo purposes allows one to turn on/off the inlineDiagrams setting.
   * @method checkUrlOpts
   * @return {void}
   */
  function checkUrlOpts() {
    const re = new RegExp('[?&]inline=([^&]*)', 'i');
    const m = (`${window.location}`).match(re);
    if (!m || m.length < 1) {
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
