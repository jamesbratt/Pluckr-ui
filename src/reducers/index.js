
import { combineReducers } from 'redux';
import charts from './charts';
import sources from './sources';

const chartConfigReducers = combineReducers({
  charts,
  sources,
});
 
export default chartConfigReducers;