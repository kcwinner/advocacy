/*
 * Took relevant parts from https://github.com/sindresorhus/camelcase
*/

export function pascalCase(input: string) {
  if (!(typeof input === 'string' || Array.isArray(input))) {
    throw new TypeError('Expected the input to be `string | string[]`');
  }

  const options = {
    pascalCase: true,
    locale: 'en-US',
  };

  if (Array.isArray(input)) {
    input = input.map(x => x.trim())
      .filter(x => x.length)
      .join('-');
  } else {
    input = input.trim();
  }

  if (input.length === 0) {
    return '';
  }

  if (input.length === 1) {
    return options.pascalCase ? input.toLocaleUpperCase(options.locale) : input.toLocaleLowerCase(options.locale);
  }

  input = input.replace(/^[_.\- ]+/, '');
  input = input.toLocaleLowerCase();

  if (options.pascalCase) {
    input = input.charAt(0).toLocaleUpperCase(options.locale) + input.slice(1);
  }

  return postProcess(input, options);
};

function postProcess(input: string, options: any) {
  return input.replace(/[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu, (_: any, p1: any) => p1.toLocaleUpperCase(options.locale))
    .replace(/\d+([\p{Alpha}\p{N}_]|$)/gu, m => m.toLocaleUpperCase(options.locale));
};