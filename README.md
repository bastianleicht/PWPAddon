# PWPAddon

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br/>
<p align="center">
  <a href="https://github.com/bastianleicht/PWPAddon">
    <img src="pwpaddon.png" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">PWPAddon</h3>
  <p align="center">
    PWPAddon allows you to push passwords using <a href="https://github.com/pglombardo/PasswordPusher">PasswordPusher</a> by selecting the Text.
    <br/>
    <br/>
    <a href="https://addons.mozilla.org/addon/password-pusher-addon/">Firefox Addon</a>
    ·
    <a href="https://github.com/bastianleicht/PWPAddon/issues">Report Bug</a>
    ·
    <a href="https://github.com/bastianleicht/PWPAddon/issues">Request Feature</a>
  </p>
</p>


<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li><a href="#installing">Installing</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#building">Building</a></li>
  </ol>
</details>


## Installing
PWPAddon is available on the [Mozilla Add-ons website](https://addons.mozilla.org/addon/password-pusher-addon/). You can install it with Firefox by simply pressing the Install button there.

## Contributing
PWPAddon is open source. If you'd like to contribute, feel free to open or comment on an [Issue on GitHub](https://github.com/bastianleicht/PWPAddon/issues).

Pull requests welcome!

<!---
A special thank-you to all current and previous [contributors](https://github.com/fbastianleicht/PWPAddon/graphs/contributors) to this extension. You're awesome.
-->

## Building

We use webpack (to assemble the modules). To develop, run `npm run watch` (to build and automatically re-build the code), and then in a second console, something like `web-ext run` to test in Firefox.

When done, `npm run build` will create a .xpi file for release.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/bastianleicht/PWPAddon.svg?style=for-the-badge
[contributors-url]: https://github.com/bastianleicht/PWPAddon/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bastianleicht/PWPAddon.svg?style=for-the-badge
[forks-url]: https://github.com/bastianleicht/PWPAddon/network/members
[stars-shield]: https://img.shields.io/github/stars/bastianleicht/PWPAddon.svg?style=for-the-badge
[stars-url]: https://github.com/bastianleicht/PWPAddon/stargazers
[issues-shield]: https://img.shields.io/github/issues/bastianleicht/PWPAddon.svg?style=for-the-badge
[issues-url]: https://github.com/bastianleicht/PWPAddon/issues
[license-shield]: https://img.shields.io/github/license/bastianleicht/PWPAddon.svg?style=for-the-badge
[license-url]: https://github.com/bastianleicht/PWPAddon/blob/master/LICENSE