
# UX Snap / Chrome Browser Extension

Fork from https://github.com/simov/screenshot-capture

## Goals

A lightweight extension to capture a full screenshot of a webpage and save it along with some metadata to a datastore.

## Known Issues
- Only works on Google's Chrome Browser
- Other extensions migth interfere with its functionality. If things do not work, disable extensions to find if that is the issue and notify me of the problem.
- Does not upload captures to a remote datastore yet.
- UX and code are a work in progress.

## Features

- Capture Viewport
- Save (automatic save)
- Preserve or downscale screenshot size on HDPI displays like Retina
- Unique screenshot date/time file name
- Save screenshots in PNG file format
- No special permissions required
- Open Source
- Introducing 'Snappy' the sarcasticly sazzy UX mascot!


## Getting Started

### Installing the Extension

Until there is a version at the Chrome Store, you have to manually install the extension on your browser. To install the extension:
- Go to the 'More Tools -> Extensions' menu on Chrome's 'ellipsis' menu on the upper right.
- Make sure to check the 'Developer Mode' checkbox
- Click on the 'Load Unpacked Extension' button
- Navigate to the directory where you downloaded or cloned the project.
- If you see a new entry with the title 'UX Snap' in the list of extensions, you are done!

### Using the Extension

Once installed, a 'teal' camera icon appears on Chrome's omnibar. To use the extension:
- Click on the UX Snap icon.
- (A popup will appear) 
- Complete the fields on the popup.
- Click the 'Submit' button.
- (the browser migt ask you for permission to download multiple files) Give the browser permission to download multiple files.
- (if sucessful, the browser saved two files that capture a screenshot in .png format, and metadata in .json format)
- Share those files with you trusty UX practitioner.


## License

The MIT License (MIT)

Copyright (c) 2018 Gonzalo Ramos <gonzo.ramos@gmail.com>

Copyright (c) 2014-2018 Simeon Velichkov <simeonvelichkov@gmail.com> (https://github.com/simov/screenshot-capture)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
