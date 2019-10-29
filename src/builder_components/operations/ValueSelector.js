import React, { Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import { VARIABLES } from '../../Constants';

const VALUE_TYPES = {
  string: 'text',
  number: 'number',
  date: 'date',
  variable: 'text',
};

class ValueSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'string',
      value: null,
    }
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ value: this.props.value.value, type: this.props.value.type });
    }
  }

  onInputChange = (e) => {
    this.setState({ value: e.target.value });
    this.props.onChange(e, this.state.type);
  }

  onTypeChange = (e, type) => {
    e.preventDefault();
    this.setState({ type, value: null });
  }

  render() {
    return (
      <InputGroup className="mb-2">
        <DropdownButton
          as={InputGroup.Prepend}
          variant="outline-secondary"
          title={this.state.type}
        >
          <Dropdown.Item onClick={(e) => this.onTypeChange(e, 'string')} href="#">String</Dropdown.Item>
          <Dropdown.Item onClick={(e) => this.onTypeChange(e, 'number')} href="#">Integer</Dropdown.Item>
          <Dropdown.Item onClick={(e) => this.onTypeChange(e, 'date')} href="#">Date</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={(e) => this.onTypeChange(e, 'variable')} href="#">Variable</Dropdown.Item>
        </DropdownButton>
        {
          this.state.type === 'variable' ?
            <select defaultValue={this.state.value || null} id={this.props.id} onChange={this.onInputChange} className="form-control">
              <option value={null} hidden>-- Select a Variable --</option>
              {VARIABLES.map(v => {
                return <option key={v.label} value={v.value}>{v.label}</option>;
              })}
            </select> :
            <FormControl type={VALUE_TYPES[this.state.type]} id={this.props.id} onChange={this.onInputChange} value={this.state.value || ''} />
        }
      </InputGroup>
    )
  }
}

export default ValueSelector;