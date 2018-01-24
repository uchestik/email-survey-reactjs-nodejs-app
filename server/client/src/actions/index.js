import axios from 'axios'
import {FETCH_USER, FETCH_SURVEYS} from './types'


// export const fetchUser = () => {
//     return function(dispatch){
//         axios.get('/api/currentuser')
//             .then(res => dispatch({type: FETCH_USER, payload:res}));
//     }
    
// }
//with arrow functions you can remove the brackets and 
//return statement if only one item is being returned
//res.data is because of the axios response objects stores data in data key
export const fetchUser = () => async dispatch => {
        const res = await axios.get('/api/currentuser')
        dispatch({type: FETCH_USER, payload:res.data});
    }

export const handleToken = (token) => async dispatch =>{
    const res = await axios.post('/api/stripe', token);
    dispatch({type: FETCH_USER, payload:res.data}); //reusing this makes it easy for the credits to automatically update 
}

export const submitSurvey = (values, history)=> async dispatch =>{
    const res = await axios.post('/api/surveys', values);

    history.push('/surveys');
    dispatch({type:FETCH_USER, PAYLOAD:res.data});
};

export const fetchSurveys = () => async dispatch =>{
    const res = await axios.get('/api/surveys');

dispatch({type:FETCH_SURVEYS, payload:res.data});
};
    
