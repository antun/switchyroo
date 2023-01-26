Fluid Implementation Switcher
=============================

Chrome extension that automatically redirects Configure implementation files to a local build.

![switcher.jpg](https://bitbucket.org/repo/adqqjE/images/2057778445-switcher.jpg)

Installation
------------
1. Login to Chrome with your Fluid account.
1. Go to https://chrome.google.com/webstore/detail/fluid-implementation-swit/lmlmaclcpfanhbfhddfoimnjcbkdjhbi/related?hl=en-US&gl=US
1. Click Add to Chrome


Manual Installation
-------------------
1. Check this out locally.
1. In Chrome, go to chrome://extensions/
1. Click Load unpacked extension...
1. Select the src/ directory of this repo.


Usage
-----
1. Open the extension by clicking its button.
1. Click enable. The button will turn blue when the extension is enabled.
1. Enter your local pattern to map *to*.
1. Do a build of whatever repo you want to test by doing $ grunt build:prod --cdn. (You *must* use the CDN option; this is what you'd want to use for testing).

Development
===========
To set yourself up for development:

1. Check out this repo.
1. Do npm install and grunt build.
1. Go to chrome://extensions, and click" Load unpacked extension...". Point to dist/implementationswitcher, e.g. ~/fluid/git/imp-implementationswitcher/dist/implementationswitcher
1. Do `npm run watch` in your shell.
1. Develop as normal. You may need to reload the extension (click Reload in chrome://extensions).

Testing
=======
Run `npm run test` to run the unit tests.

Deployment
----------
Before you can deploy, you'll need to be granted access to the fluid-chrome-extensions publisher, which is the group account we use for publishing Chrome extensions. To access that:

1. Get someone to add you to the fluid-chrome-extensions Google group here: https://groups.google.com/forum/#!managemembers/fluid-chrome-extensions/members/active
1. Accept the invite.
1. Go directly to the extension page: https://chrome.google.com/webstore/developer/edit/lmlmaclcpfanhbfhddfoimnjcbkdjhbi# . You will probably have to accept terms and conditions..
1. You should then be able to see all our extensions at: https://chrome.google.com/webstore/developer/dashboard/u0837f19a2a435838f5e347a4b92bb5bc

Deployment steps:

1. Do a grunt publish. This will create a new version and bump the package file. It will also create an installable zip file in dist/implementationswitcher.zip.
1. Go to https://chrome.google.com/webstore/developer/dashboard and login with your Fluid account. If you don't have access to the fluid-chrome-extensions group for publishing extensions, you will need to ask someone to add you via https://groups.google.com/forum/#!managemembers/fluid-chrome-extensions/
1. From the drop-down, choose the "fluid-chrome-extensions (Fluid Chrome Extensions)" group. You should see this extension.
1. Click edit on the extension.
1. Upload the implementationswitcher.zip file.
