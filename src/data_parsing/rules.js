import { OPERATOR_VALUES, VARIABLES } from '../Constants';

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
    let rightOperandVar = null;

    const leftOperandDateVar = new Date(leftOperand).getTime();

    if (isNaN(leftOperandDateVar)) {
      throw new Error(`DATA_KEY must be of type date`);
    }

    const variables = VARIABLES.reduce((acc, cur) => {
      acc[cur.value] = cur.value;
      return acc;
    }, {});

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    switch(rightOperand) {
      case variables.CURRENT_MONTH_BEGINNING:
        rightOperandVar = new Date(year, month, 1).getTime();
        break;
      case variables.LAST_30_DAYS:
        rightOperandVar = new Date(year, month, day).getTime() - 30*24*60*60*1000;
        break;
      case variables.LAST_7_DAYS:
        rightOperandVar = new Date(year, month, day).getTime() - 7*24*60*60*1000;
        break;
      case variables.LAST_24_HOURS:
        rightOperandVar = new Date(year, month, day).getTime() - 24*60*60*1000;
        break;
      case variables.CURRENT_DAY:
        rightOperandVar = new Date(year, month, day).getTime();
        break;
      default:
        rightOperandVar = null;
        break;
    }

    switch(operator) {
      case OPERATOR_VALUES.EQUAL_TO:
        return leftOperandDateVar === rightOperandVar;
      case OPERATOR_VALUES.NOT_EQUAL_TO:
        return leftOperandDateVar !== rightOperandVar;
      case OPERATOR_VALUES.GREATER_THAN:
        return leftOperandDateVar > rightOperandVar;
      case OPERATOR_VALUES.LESS_THAN:
        return leftOperandDateVar < rightOperandVar;
      case OPERATOR_VALUES.GREATER_THAN_OR_EQUAL_TO:
        return leftOperandDateVar >= rightOperandVar;
      case OPERATOR_VALUES.LESS_THAN_OR_EQUAL_TO:
        return leftOperandDateVar <= rightOperandVar;
      default:
        return false;
    }
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