import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state;
};

const Operations = (props) => {

  const operations = props.operations.filter(operation => {
    if (operation.dataSetId === props.dataSetId) {
      return <li className="nav-item">
        test
      </li>
    }
  });

  return (
    <ul className="navbar-nav mr-auto">
      {operations}
    </ul>
  );
}

export default connect(
  mapStateToProps
)(Operations);