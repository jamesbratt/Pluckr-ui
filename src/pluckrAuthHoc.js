import Login from './Login';

const ChartsAuthChecked = (Component) => {
    const tokenObj = localStorage.getItem('pluckr_token');

    if (tokenObj) {
        return Component;
    }

    return Login;
}
export default ChartsAuthChecked;