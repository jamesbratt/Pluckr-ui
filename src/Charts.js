import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state
};

class Charts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>Charts</div>
        );
    }
}

export default connect(
    mapStateToProps
  )(Charts);