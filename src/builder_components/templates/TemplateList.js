import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCharts } from '../../actions/chart';
import Loader from '../../Loader';

const mapStateToProps = (state) => {
  return {
    charts: state.charts,
    user: state.user[0],
    loader: state.loader,
    dataProviders: state.dataProviders,
  };
};

class TemplateList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        createChartModalShow: false
      }
    }

    componentDidMount() {
      const user = this.props.user.username;
      const apiKey = this.props.user.api_key;
      this.props.dispatch(
        fetchCharts(
          apiKey,
          user,
        )
      );
    }

    render() {
      return (
        <React.Fragment>
          {this.props.loader ? <Loader /> :
            <React.Fragment>
            {this.props.charts.length === 0 ? <p>There are no templates available</p> :
            <div className='row'>
              {
                this.props.charts.map((chart) => {
                  return (
                    <div key={chart.name} className='col-md-3'>
                      <div className='add-chart-card'>
                        <div className="chart-card-inner">
                          <h3>{chart.name}</h3>
                          <div className="btn-group-fixed">
                            <button onClick={() => this.removeChart(chart.id)} type="button" className="btn btn-success">Install</button>
                          </div>
                        </div>
                      </div>
                    </div>                
                  )
                })
              }
            </div>}
          </React.Fragment>}
        </React.Fragment>
      )
    }
}

export default connect(
  mapStateToProps
)(TemplateList);