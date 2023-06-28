import fs from 'fs';
import crypto from 'crypto';

(() => {
  const metadataDirPath = process.argv[2];
  if (!fs.existsSync(metadataDirPath)) {
    console.error('Wrong metadata dir path provided!');
    return;
  }

  const files = fs.readdirSync(metadataDirPath);
  if (!files.length) {
    console.error('Metadata dir path has no files!!');
    return;
  }

  const duplicates = [];
  const uniqueTraitsHashes = {};

  files.forEach((file) => {
    const token = JSON.parse(fs.readFileSync(`${metadataDirPath}/${file}`));

    const traitsWithValuesString = token.attributes.map((attribute) => `${attribute.trait_type}: ${attribute.value}`);
    const traitsHash = crypto.createHash('md5').update(traitsWithValuesString.join(',')).digest('hex');

    if (!uniqueTraitsHashes[traitsHash]) {
      uniqueTraitsHashes[traitsHash] = token;
      return;
    }

    duplicates.push(({ a: uniqueTraitsHashes[traitsHash], b: token }));
  });

  duplicates.forEach(({ a, b }) => console.log('Duplicate tokens:', { a, b }));
})();