import { MATH_SYMBOLS_VALUES } from '../Constants';

export const executeBasicCalculation = (leftOperand, symbol, rightOperand) => {

  if (isNaN(leftOperand) || isNaN(rightOperand)) {
    throw new Error(`Calculations can only be performed on numbers`);
  };

  switch (symbol) {
    case MATH_SYMBOLS_VALUES.ADDITION:
      return leftOperand + rightOperand;
    case MATH_SYMBOLS_VALUES.SUBTRACTION:
      return leftOperand - rightOperand;
    case MATH_SYMBOLS_VALUES.MULTIPLICATION:
      return leftOperand * rightOperand;
    case MATH_SYMBOLS_VALUES.DIVISION:
      return leftOperand / rightOperand;
    default:
      return;
  }
};
