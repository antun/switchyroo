Switchyroo
==========

Chrome extension for re-writing URLs.

![switcher.jpg](https://bitbucket.org/repo/adqqjE/images/2057778445-switcher.jpg)

End-User Installation
---------------------
TODO

Manual (Develoer) Installation
------------------------------
1. Check this out locally.
2. In Chrome, go to chrome://extensions/
3. Click Load unpacked extension...
4. Select the src/ directory of this repo.


Development
===========
To set yourself up for development:

1. Check out this repo.
2. Do `npm install` and `npm run build`. (Running `npm run build` the first time creates the dist/ directory.)
3. Go to chrome://extensions, and click" Load unpacked extension...". Select the dist/switchyroo directory.
4. Do `npm run watch` in your shell.
5. Develop as normal. You may need to reload the extension (click Reload in chrome://extensions).

Testing
=======
Run `npm run test` to run the unit tests. These will run automatically on watch too.

Deployment
----------
TODO


Deployment steps:

1. Do a `npm run publish`. This will create a new version and bump the package file. It will also create an installable zip file in dist/switchyroo.zip.
2. Go to https://chrome.google.com/webstore/developer/dashboard and login .
3. Click edit on the extension.
4. Upload the switchyroo.zip file.
