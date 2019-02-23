import React from 'react';

const ChartConfiguration = (props) => {
  return (
    <div className="row">
      <div className="col-md-12 grey-panel">
        <form>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>Select X axis Type</label>
                <select className="form-control">
                  <option>Linear</option>
                  <option>Datetime</option>
                  <option>Category</option>
                  <option>Logarothmic</option>
                  <option>None</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChartConfiguration;