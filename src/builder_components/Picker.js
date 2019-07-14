import React, { Component } from 'react';
import { append } from 'ramda';

class Picker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickedList: [],
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.items !== this.props.items) {
      this.setState({ pickedList: [] });
    }
  }

  addToPickList = (e) => {
    e.preventDefault();
    const item = e.target[0].value;
    if (item) {
      const pickedList = append(item, this.state.pickedList);
      this.setState({ pickedList });
      this.props.callBack({
        target: {
          name: this.props.label,
          value: pickedList,
        }
      });
    }
  }

  removeFromPickList = (item, e) => {
    e.preventDefault();
    const pickedList = this.state.pickedList.filter(list => list !== item);
    this.setState({ pickedList });
    this.props.callBack({
      target: {
        name: this.props.label,
        value: pickedList,
      }
    });
  }

  render() {
    return (
      <div className="picker">
        <form onSubmit={this.addToPickList} class="form-inline">
          <label class="my-1 mr-2">{this.props.label}</label>
          <select class="custom-select my-1 mr-sm-2">
            <option value="">-- Select a {this.props.label} --</option>;
            {this.props.items.map((item) => {
                return <option key={item} value={item}>{item}</option>
            })}
          </select>
          <button type="submit" class="btn btn-primary my-1">Add</button>
        </form>
        <ul className="list-group">
          {this.state.pickedList.map((item) => {
              return <li className="list-group-item">{item}<button onClick={(e) => this.removeFromPickList(item, e)} className="btn btn-sm btn-danger float-right">Remove</button></li>
          })}
        </ul>
      </div>
    )
  }
}

export default Picker;