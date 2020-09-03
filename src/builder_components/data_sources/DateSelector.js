import React, { Component } from 'react';
import { VARIABLES } from '../../Constants';

class DateSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      useCustom: false,
    }
  }

  componentDidMount() {
    const isVariable = VARIABLES.find(v => v.value === this.props.value);
    if (!isVariable) {
      this.setState({ useCustom: true })
    }
  }

  useCustom = () => {
    this.setState({ useCustom: !this.state.useCustom })
  }

  onChange = (e) => {
    e.preventDefault();
    const item = e.target.value;
    if (item) {
      this.props.onChange({
        target: {
          name: this.props.name,
          value: item,
          isDate: true,
        }
      });
    }
  }

  render() {
    let content = null;
    const isVariable = VARIABLES.find(v => v.value === this.props.value);
    if (this.props.useVariables && !this.state.useCustom) {
      content = (
        <div class="form-group">
          <label>{this.props.name} <button className="btn btn-sm btn-link" onClick={() => this.props.toggle(!this.props.isDate)}><small>Is this a date/datetime?</small></button></label>
          <select defaultValue={this.props.value || null} onChange={this.onChange} className="form-control">
            <option value={null} hidden>-- Select a Variable --</option>
            {VARIABLES.map(v => {
              return <option key={v.label} value={v.value}>{v.label}</option>;
            })}
          </select>
          <button onClick={this.useCustom} className="btn btn-link">Custom Date</button>
        </div>
      )
    }
    if (!this.props.useVariables && !isVariable) {
      content = (
        <div class="form-group">
          <label>{this.props.name} <button className="btn btn-sm btn-link" onClick={() => this.props.toggle(!this.props.isDate)}><small>Is this a date/datetime?</small></button></label>
          <input defaultValue={this.props.value} name={this.props.name} onChange={this.onChange} type="date" className="form-control" placeholder={this.props.name} />
          { this.props.useVariables ? <button onClick={this.useCustom} className="btn btn-link">Variable Date</button> : null}
        </div>
      )   
    }
    if (!isVariable && this.state.useCustom) {
      content = (
        <div class="form-group">
          <label>{this.props.name} <button className="btn btn-sm btn-link" onClick={() => this.props.toggle(!this.props.isDate)}><small>Is this a date/datetime?</small></button></label>
          <input defaultValue={this.props.value} name={this.props.name} onChange={this.onChange} type="date" className="form-control" placeholder={this.props.name} />
          { this.props.useVariables ? <button onClick={this.useCustom} className="btn btn-link">Variable Date</button> : null}
        </div>
      )   
    }
    if (isVariable && this.state.useCustom) {
      content = (
        <div class="form-group">
          <label>{this.props.name} <button className="btn btn-sm btn-link" onClick={() => this.props.toggle(!this.props.isDate)}><small>Is this a date/datetime?</small></button></label>
          <input defaultValue={this.props.value} name={this.props.name} onChange={this.onChange} type="date" className="form-control" placeholder={this.props.name} />
          { this.props.useVariables ? <button onClick={this.useCustom} className="btn btn-link">Variable Date</button> : null}
        </div>
      )   
    }

    return (
      <>
        {content}
      </>
    )
  }
}

export default DateSelector;