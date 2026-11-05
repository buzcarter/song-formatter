/*!
 * Document   : UkeGeeks Song Formatter Scripts
 * Created on : Sep 15, 2012, 7:51:38 AM
 * Author     : Courts
 * Homepage   : https://github.com/buzcarter/song-formatter#readme
 */

/**
 * Entry point for the browser bundle (dist/song-formatter.bundle.js): puts the API on
 * `window.ukeGeeks`, where pages written for the old UkeGeeks library expect it.
 */
import ukeGeeks from './ukeGeeks';

declare global {
  interface Window {
    ukeGeeks?: typeof ukeGeeks,
  }
}

window.ukeGeeks = Object.assign(window.ukeGeeks || {}, ukeGeeks);

export default ukeGeeks;
