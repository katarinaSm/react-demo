const page = {
  elements: {
    emailInputField: {
      selector: 'input[type=email]',
    },
    emailErrorMessage: {
      selector: '[data-testid="email"]',
    },
    amountInputField: {
      selector: 'input[type=tel]',
    },
    amountErrorMessage: {
      selector: '[data-testid="amount"]',
    },
    submit: {
      selector: '[data-testid="button"] button',
    },
  },
};

export default page;
