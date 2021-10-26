import {
    Typography
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

function Home() {
    const history = useHistory();

    history.push('/h')

    return (
        <Typography>Home Screen!</Typography>
    )
}

export default Home;