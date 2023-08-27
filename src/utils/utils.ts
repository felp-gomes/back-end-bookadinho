export function validateProfileEmail(email: string): boolean {
  const regexLocalPart = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  const regexDomain = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const part = email.split('@');

  if (part.length !== 2) {
    return false;
  }

  if (!regexLocalPart.test(part[0])) {
    return false;
  }

  if (!regexDomain.test(part[1])) {
    return false;
  }

  return true;
}

export function debugLogError(message: string, information: Error) {
  console.debug(`\x1b[34m[${message}]\x1b[0m`);
  console.debug(information);
  console.debug(`\x1b[34m[END INFORMATION]\x1b[0m`);
}
