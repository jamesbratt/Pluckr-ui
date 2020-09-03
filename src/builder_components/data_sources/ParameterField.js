import React, { useState } from 'react';
import DateSelector from './DateSelector';

import { pathOr } from 'ramda';
import { DATA_TYPES } from '../../Constants';

const ParameterField = ({ type, parameterField, paramValue, onChange }) => {

  const [isDate, toggleDate] = useState(pathOr(false, ['isDate'], paramValue));

  const toggle = (isDate) => {
    toggleDate(isDate);

    // Make sure to empty the field
    // when switching back to its standard type
    if (!isDate) {
      onChange({
        target: {
          name: parameterField.name,
          isDate: false,
        }
      })
    }
  }

  const fieldType = {};
  fieldType[DATA_TYPES.int] = 'number';
  fieldType[DATA_TYPES.string] = 'text';

  const val = pathOr(null, ['value'], paramValue);

  const primitiveField = (
    <React.Fragment key={parameterField.name}>
      <div class="form-group">
        <label>{parameterField.name} <button className="btn btn-sm btn-link" onClick={() => toggle(!isDate)}><small>Is this a date/datetime?</small></button></label>
        <input defaultValue={val} name={parameterField.name} onKeyUp={onChange} type={fieldType[type]} className="form-control" />
        <small class="form-text text-muted">{parameterField.description}</small>
      </div>
    </React.Fragment>
  )

  const dateField = (
    <React.Fragment key={parameterField.name}>
      <DateSelector useVariables={true} name={parameterField.name} value={val} onChange={onChange} isDate={isDate} toggle={toggle} />
    </React.Fragment>
  )

  return <>{isDate ? dateField : primitiveField} </>
};

export default ParameterField;