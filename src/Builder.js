import React, { Component } from 'react';
import Chart from './builder_components/Chart';
import AddChart from './builder_components/AddChart';
import ChartList from './builder_components/ChartList';
import { Navbar, Nav } from 'react-bootstrap';
import { GenerateGuid } from './utils/Helpers';
import { EASY_OAUTH_REDIRECT } from './Constants';
import { addChart } from './actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state
};

class Builder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chartToEdit: null,
    };
  }

  selectChartToEdit = (chart) => {
    this.setState({chartToEdit: chart});
  }

  componentDidMount() {
    const stravaToken = localStorage.getItem('token');
    if(!stravaToken) {
      document.location.replace(EASY_OAUTH_REDIRECT);
    }
  }

  render() {
    return (
      <div id='chart-canvas'>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">Chart Builder</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {this.props.charts.length > 0 ? <ChartList charts={this.props.charts} onSelect={this.selectChartToEdit} /> : null}
            </Nav>
            <AddChart />
          </Navbar.Collapse>
        </Navbar>
        {this.state.chartToEdit ? <Chart id={this.state.chartToEdit.id} name={this.state.chartToEdit.name} /> : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(Builder);
