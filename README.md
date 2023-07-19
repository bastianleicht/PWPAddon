# PWPAddon

![](./pwpaddon.png)

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
