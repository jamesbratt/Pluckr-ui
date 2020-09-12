import React, { useState } from 'react';
import DateSelector from './DateSelector';

import { pathOr } from 'ramda';
import { DATA_TYPES } from '../../Constants';

const ParameterField = ({ type, parameterField, paramValue, onChange }) => {

  const [isDate, toggleDate] = useState(pathOr(false, ['isDate'], paramValue));
  const [showExamples, toggleExamples] = useState(false);
  const hasExamples = pathOr(false, ['examples'], parameterField);

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
  const dateSwitcher = <button className="btn btn-sm btn-link" onClick={() => toggle(!isDate)}><small>Show Date Field</small></button>
  const exampleSwitcher = <button className="btn btn-sm btn-link" onClick={() => toggleExamples(true)}><small>Show Examples</small></button>
  
  const primitiveField = (
    <React.Fragment key={parameterField.name}>
      <div class="form-group">
        <label>{parameterField.name} {hasExamples ? exampleSwitcher : dateSwitcher}</label>
        <input defaultValue={val} name={parameterField.name} onKeyUp={onChange} type={fieldType[type]} className="form-control" />
        <small class="form-text text-muted">{parameterField.description}</small>
      </div>
    </React.Fragment>
  )

  const listField = () => (
    <React.Fragment key={parameterField.name}>
      <div className="form-group">
        <label>{parameterField.name} <button className="btn btn-sm btn-link" onClick={() => toggleExamples(false)}><small>Hide Examples</small></button></label>
        <select name={parameterField.name} value={val} onChange={onChange} className="form-control">
          <option value="">-- Select {parameterField.name} --</option>;
          {Object.keys(parameterField.examples).map((key) => {
            return <option key={parameterField.examples[key].value} value={parameterField.examples[key].value}>{parameterField.examples[key].summary}</option>
          })}
        </select>
      </div>
    </React.Fragment>
  )

  const dateField = (
    <React.Fragment key={parameterField.name}>
      <DateSelector useVariables={true} name={parameterField.name} value={val} onChange={onChange} isDate={isDate} toggle={toggle} />
    </React.Fragment>
  )

  if (isDate) {
    return dateField;
  }

  if (showExamples) {
    return listField();
  }

  return primitiveField;
};

export default ParameterField;