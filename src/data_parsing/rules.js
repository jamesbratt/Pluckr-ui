import { OPERATOR_VALUES } from '../Constants';

const executeRule = (leftOperand, operator, rightOperand ,type) => {
  if (type === 'date') {
    const leftOperandDate = new Date(leftOperand).getTime();

    if (isNaN(leftOperandDate)) {
      throw new Error(`DATA_KEY must be of type ${type}`);
    }

    const rightOperandDate = new Date(rightOperand).getTime();

    switch(operator) {
      case OPERATOR_VALUES.EQUAL_TO:
        return leftOperandDate === rightOperandDate;
      case OPERATOR_VALUES.NOT_EQUAL_TO:
        return leftOperandDate !== rightOperandDate;
      case OPERATOR_VALUES.GREATER_THAN:
        return leftOperandDate > rightOperandDate;
      case OPERATOR_VALUES.LESS_THAN:
        return leftOperandDate < rightOperandDate;
      case OPERATOR_VALUES.GREATER_THAN_OR_EQUAL_TO:
        return leftOperandDate >= rightOperandDate;
      case OPERATOR_VALUES.LESS_THAN_OR_EQUAL_TO:
        return leftOperandDate <= rightOperandDate;
      default:
        return false;
    }
  }

  if (type === 'variable') {
    return false;
  }

  if (type !== typeof leftOperand) {
    throw new Error(`DATA_KEY must be of type ${type}`);
  }
  switch(operator) {
    case OPERATOR_VALUES.EQUAL_TO:
      return leftOperand === rightOperand;
    case OPERATOR_VALUES.NOT_EQUAL_TO:
      return leftOperand !== rightOperand;
    case OPERATOR_VALUES.GREATER_THAN:
      return leftOperand > rightOperand;
    case OPERATOR_VALUES.LESS_THAN:
      return leftOperand < rightOperand;
    case OPERATOR_VALUES.GREATER_THAN_OR_EQUAL_TO:
      return leftOperand >= rightOperand;
    case OPERATOR_VALUES.LESS_THAN_OR_EQUAL_TO:
      return leftOperand <= rightOperand;
    default:
      return false;
  }
};

export default executeRule;