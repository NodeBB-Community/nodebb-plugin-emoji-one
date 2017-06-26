var path = require('path');
var download = require('download');
const fromPairs = require('lodash.frompairs');
const emoji = require('emojione/emoji');

const packageURL = 'https://d1j8pt39hxlh3d.cloudfront.net/emoji/emojione/3.0/EmojiOne_3.0_32x32_png.zip';

function defineEmoji(callback) {
  download(packageURL, path.join(__dirname, 'emoji'), {
    extract: true,
  }).then(() => {
    const pairs = Object.keys(emoji).map((key) => {
      const e = emoji[key];

      const name = e.name.toLowerCase().replace(/[^a-z0-9-]+/g, '_');
      const aliases = [e.shortname, ...e.shortname_alternates].map((str) => {
        return str.slice(1, -1);
      });
      const ascii = e.ascii.map(x => x.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      const character = String.fromCodePoint(parseInt(e.code_points.base, 16));
      const categories = [e.category];

      return [name, {
        image: key + '.png',
        aliases,
        ascii,
        character,
        categories,
        keywords: e.keywords,
      }];
    });

    const dictionary = fromPairs(pairs);

    callback(null, {
      name: 'EmojiOne',
      id: 'emoji-one',
	    attribution: 'Emoji icons provided free by <a href="https://www.emojione.com" target="_blank" rel="noopener">EmojiOne</a>',
      license: '<a href="https://d1j8pt39hxlh3d.cloudfront.net/license-free.pdf" target="_blank" rel="noopener">EmojiOne Free License</a>',
      mode: 'images',
      images: {
        directory: 'emoji',
      },
      dictionary,
    });
  }, callback);
}

module.exports = defineEmoji;
