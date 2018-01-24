import React,{Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {Link} from 'react-router-dom'
import SurveyField from './SurveyField'
import validateEmails from '../../utils/validateEmails'
import _ from 'lodash';
import formFields from './formFields'



class SurveyForm extends Component{

    renderFields(){
            return _.map(formFields,({label, name})=>{
                return <Field
                    key={name}
                    component={SurveyField}
                    type='text'
                    label={label}
                    name={name}
                    />
            })
    }

    render(){
        return(
            <div>
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                    {this.renderFields()}
                    <Link to={'/surveys'} className='red btn-flat left white-text'>
                        Cancel
                    </Link>
                    <button className='teal btn-flat right white-text' type='submit'>
                        Next
                        <i className='material-icons right'>done</i>
                    </button>
                </form>
            </div>
        )
    }
}

function validate(values){
    const errors = {};

    errors.recipients = validateEmails(values.recipients || '');

    _.each(formFields, ({name})=>{
        if(!values[name]){
            errors[name]='You must provide a value'
        }
    });

   

    return errors;
}

export default reduxForm({
    validate:validate,
    form:'surveyForm', //inititalizes and configures the form
    destroyOnUnmount:false //this is true by default. This persists our form values
})(SurveyForm);