# textlint-plugin-satsuki

[![Build Status](https://travis-ci.org/7pairs/textlint-plugin-satsuki.svg?branch=master)](https://travis-ci.org/7pairs/textlint-plugin-satsuki)
[![Coverage Status](https://coveralls.io/repos/github/7pairs/textlint-plugin-satsuki/badge.svg?branch=master)](https://coveralls.io/github/7pairs/textlint-plugin-satsuki?branch=master)

[Satsuki notation](http://adiary.org/v3man/Satsuki/) support for [textlint](https://github.com/textlint/textlint). With this plugin, textlint ignores errors in blockquote elements, pre elements, and inline tags.

## Installation

Run follow command.

    $ npm install textlint-plugin-satsuki

## Usage

Add following codes to `.textlintrc` .

```
{
    "plugins": [
        "satsuki"
    ]
}
```

## Tests

Run follow command.

    $ npm test

## License

Apache License, Version 2.0
