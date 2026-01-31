export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email je povinný';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Zadejte platný email';
  }
  return '';
};

export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return 'Telefon je povinný';
  }
  const phoneRegex = /^(\+420|\+421)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/;
  const cleanPhone = phone.replace(/\s/g, '');
  if (!phoneRegex.test(phone) && !/^[0-9]{9}$/.test(cleanPhone)) {
    return 'Zadejte platné telefonní číslo (např. 777 123 456 nebo +420 777 123 456)';
  }
  return '';
};

export const validatePostalCode = (postalCode) => {
  if (!postalCode || postalCode.trim() === '') {
    return 'PSČ je povinné';
  }
  const postalCodeRegex = /^[0-9]{3}\s?[0-9]{2}$/;
  if (!postalCodeRegex.test(postalCode)) {
    return 'Zadejte platné PSČ (např. 110 00 nebo 11000)';
  }
  return '';
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} je povinné`;
  }
  return '';
};

export const filterPhoneInput = (value) => {
  let cleaned = value.replace(/[^\d+]/g, '');
  
  if (cleaned.startsWith('+')) {
    const countryCodeMatch = cleaned.match(/^(\+\d{1,3})(.*)/);
    if (countryCodeMatch) {
      const countryCode = countryCodeMatch[1].substring(0, 4);
      let number = countryCodeMatch[2].replace(/\D/g, '');
      
      number = number.substring(0, 9);
      const formatted = [];
      for (let i = 0; i < number.length; i += 3) {
        formatted.push(number.substring(i, i + 3));
      }
      
      return formatted.length > 0 ? `${countryCode} ${formatted.join(' ')}` : countryCode;
    }
  }
  
  cleaned = cleaned.replace(/\D/g, '');
  cleaned = cleaned.substring(0, 9);
  
  const formatted = [];
  for (let i = 0; i < cleaned.length; i += 3) {
    formatted.push(cleaned.substring(i, i + 3));
  }
  
  return formatted.join(' ');
};

export const filterPostalCodeInput = (value) => {
  let cleaned = value.replace(/\D/g, '');
  cleaned = cleaned.substring(0, 5);
  
  if (cleaned.length > 3) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3)}`;
  }
  
  return cleaned;
};

export const filterTextInput = (value) => {
  const filtered = value.replace(/[^a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽäôľĺŕňťšďčýžÄÔĽĹŔŇŤŠĎČÝŽ\s\-']/g, '');
  return filtered.substring(0, 100);
};

export const filterAddressInput = (value) => {
  const filtered = value.replace(/[^a-zA-Z0-9áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽäôľĺŕňťšďčýžÄÔĽĹŔŇŤŠĎČÝŽ\s\-/.,]/g, '');
  return filtered.substring(0, 200);
};

export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\s/g, '');
  
  if (cleaned.startsWith('+420') || cleaned.startsWith('+421')) {
    const countryCode = cleaned.substring(0, 4);
    const number = cleaned.substring(4);
    if (number.length >= 3) {
      const formatted = number.match(/.{1,3}/g)?.join(' ') || number;
      return `${countryCode} ${formatted}`;
    }
    return cleaned;
  }
  
  if (cleaned.length >= 3) {
    return cleaned.match(/.{1,3}/g)?.join(' ') || cleaned;
  }
  
  return cleaned;
};

export const formatPostalCode = (postalCode) => {
  const cleaned = postalCode.replace(/\s/g, '');
  
  if (cleaned.length > 3) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 5)}`;
  }
  
  return cleaned;
};
