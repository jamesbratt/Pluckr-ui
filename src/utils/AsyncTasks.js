import { whoAsyncTasks } from '../data_sources/Who';

export default (username, apiKey) => {
  whoAsyncTasks(username, apiKey);
};