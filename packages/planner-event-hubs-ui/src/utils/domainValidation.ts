import isFQDN from 'validator/lib/isFQDN';

export const isValidDomains = (domainString: string): boolean => {
  if (domainString === '') {
    return true;
  }
  const domainsArray = domainString?.split(',');
  for (let index = 0; index < domainsArray.length; index++) {
    const domain: string = domainsArray[index].trim();
    if (!isFQDN(domain)) {
      return false;
    }
  }
  return true;
};
