import { reactive, ref, computed } from 'vue';
import { 
  validateEmail, 
  validatePhone, 
  validatePostalCode, 
  validateRequired,
  filterPhoneInput,
  filterPostalCodeInput,
  filterTextInput,
  filterAddressInput
} from '~/utils/validation';

export const useFormValidation = (customerInfo, billingAddress) => {
  const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    billingStreet: '',
    billingCity: '',
    billingPostalCode: ''
  });

  const touched = reactive({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    street: false,
    city: false,
    postalCode: false,
    billingStreet: false,
    billingCity: false,
    billingPostalCode: false
  });

  const showValidationSummary = ref(false);

  const handlePhoneInput = (field) => {
    const filtered = filterPhoneInput(customerInfo.value.phone);
    customerInfo.value.phone = filtered;
    if (touched[field]) {
      validateField(field);
    }
  };

  const handlePostalCodeInput = (field) => {
    const filtered = filterPostalCodeInput(customerInfo.value.address.postalCode);
    customerInfo.value.address.postalCode = filtered;
    if (touched[field]) {
      validateField(field);
    }
  };

  const handleBillingPostalCodeInput = (field) => {
    const filtered = filterPostalCodeInput(billingAddress.postalCode);
    billingAddress.postalCode = filtered;
    if (touched[field]) {
      validateField(field);
    }
  };

  const handleTextInput = (field) => {
    let filtered;
    if (field === 'firstName') {
      filtered = filterTextInput(customerInfo.value.firstName);
      customerInfo.value.firstName = filtered;
    } else if (field === 'lastName') {
      filtered = filterTextInput(customerInfo.value.lastName);
      customerInfo.value.lastName = filtered;
    } else if (field === 'city') {
      filtered = filterTextInput(customerInfo.value.address.city);
      customerInfo.value.address.city = filtered;
    } else if (field === 'billingCity') {
      filtered = filterTextInput(billingAddress.city);
      billingAddress.city = filtered;
    }
    
    if (touched[field]) {
      validateField(field);
    }
  };

  const handleAddressInput = (field) => {
    let filtered;
    if (field === 'street') {
      filtered = filterAddressInput(customerInfo.value.address.street);
      customerInfo.value.address.street = filtered;
    } else if (field === 'billingStreet') {
      filtered = filterAddressInput(billingAddress.street);
      billingAddress.street = filtered;
    }
    
    if (touched[field]) {
      validateField(field);
    }
  };

  const validateField = (field) => {
    const info = customerInfo.value;
    
    switch(field) {
      case 'firstName':
        errors.firstName = validateRequired(info.firstName, 'Jméno');
        break;
      case 'lastName':
        errors.lastName = validateRequired(info.lastName, 'Příjmení');
        break;
      case 'email':
        errors.email = validateEmail(info.email);
        break;
      case 'phone':
        errors.phone = validatePhone(info.phone);
        break;
      case 'street':
        errors.street = validateRequired(info.address.street, 'Ulice a číslo');
        break;
      case 'city':
        errors.city = validateRequired(info.address.city, 'Město');
        break;
      case 'postalCode':
        errors.postalCode = validatePostalCode(info.address.postalCode);
        break;
      case 'billingStreet':
        errors.billingStreet = validateRequired(billingAddress.street, 'Ulice a číslo');
        break;
      case 'billingCity':
        errors.billingCity = validateRequired(billingAddress.city, 'Město');
        break;
      case 'billingPostalCode':
        errors.billingPostalCode = validatePostalCode(billingAddress.postalCode);
        break;
    }
  };

  const handleBlur = (field) => {
    touched[field] = true;
    validateField(field);
  };

  const validateAllFields = () => {
    touched.firstName = true;
    touched.lastName = true;
    touched.email = true;
    touched.phone = true;
    touched.street = true;
    touched.city = true;
    touched.postalCode = true;
    
    validateField('firstName');
    validateField('lastName');
    validateField('email');
    validateField('phone');
    validateField('street');
    validateField('city');
    validateField('postalCode');
    
    if (!customerInfo.value.billingAddressSameAsShipping) {
      touched.billingStreet = true;
      touched.billingCity = true;
      touched.billingPostalCode = true;
      
      validateField('billingStreet');
      validateField('billingCity');
      validateField('billingPostalCode');
    }
    
    const hasErrors = !isFormValid.value;
    showValidationSummary.value = hasErrors;
    
    return isFormValid.value;
  };

  const errorMessages = computed(() => {
    const messages = [];
    if (errors.firstName) messages.push(errors.firstName);
    if (errors.lastName) messages.push(errors.lastName);
    if (errors.email) messages.push(errors.email);
    if (errors.phone) messages.push(errors.phone);
    if (errors.street) messages.push(errors.street);
    if (errors.city) messages.push(errors.city);
    if (errors.postalCode) messages.push(errors.postalCode);
    if (!customerInfo.value.billingAddressSameAsShipping) {
      if (errors.billingStreet) messages.push('Fakturační: ' + errors.billingStreet);
      if (errors.billingCity) messages.push('Fakturační: ' + errors.billingCity);
      if (errors.billingPostalCode) messages.push('Fakturační: ' + errors.billingPostalCode);
    }
    return messages;
  });

  const isFormValid = computed(() => {
    const info = customerInfo.value;
    
    const hasNoErrors = !errors.firstName && !errors.lastName && !errors.email && 
                        !errors.phone && !errors.street && !errors.city && !errors.postalCode;
    
    const requiredFields = [
      info.firstName,
      info.lastName,
      info.email,
      info.phone,
      info.address.street,
      info.address.city,
      info.address.postalCode
    ];
    
    const mainFieldsValid = requiredFields.every(field => field && field.trim() !== '');
    
    const emailValid = validateEmail(info.email) === '';
    const phoneValid = validatePhone(info.phone) === '';
    const postalCodeValid = validatePostalCode(info.address.postalCode) === '';
    
    if (!info.billingAddressSameAsShipping) {
      const billingFields = [
        billingAddress.street,
        billingAddress.city,
        billingAddress.postalCode
      ];
      const billingFieldsValid = billingFields.every(field => field && field.trim() !== '');
      const billingPostalCodeValid = validatePostalCode(billingAddress.postalCode) === '';
      const billingHasNoErrors = !errors.billingStreet && !errors.billingCity && !errors.billingPostalCode;
      
      return mainFieldsValid && emailValid && phoneValid && postalCodeValid && 
             billingFieldsValid && billingPostalCodeValid && hasNoErrors && billingHasNoErrors;
    }
    
    return mainFieldsValid && emailValid && phoneValid && postalCodeValid && hasNoErrors;
  });

  const clearBillingErrors = () => {
    errors.billingStreet = '';
    errors.billingCity = '';
    errors.billingPostalCode = '';
  };

  return {
    errors,
    touched,
    showValidationSummary,
    errorMessages,
    isFormValid,
    handlePhoneInput,
    handlePostalCodeInput,
    handleBillingPostalCodeInput,
    handleTextInput,
    handleAddressInput,
    handleBlur,
    validateAllFields,
    clearBillingErrors
  };
};
