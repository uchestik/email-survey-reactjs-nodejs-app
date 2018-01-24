//surveynew shows the survey form and survey review components
import React,{Component} from 'react'
import {reduxForm} from 'redux-form'
import SurveyForm from './SurveyForm'
import SurveyFormReview from './SurveyFormReview'



class SurveyNew extends Component{
    //es6 state initialization
    //no need for constructor or super
    state = {showFormReview:false};
    
    renderContent(){
        if(this.state.showFormReview){
            return <SurveyFormReview 
                onCancel={()=>this.setState({showFormReview:false})}
            />
        }

        return <SurveyForm 
            onSurveySubmit={()=> this.setState({showFormReview:true})}
            />
    }

    render(){
        return(
            <div>
                {this.renderContent()}
            </div>
        )
    }
}

export default reduxForm({
    form:'surveyForm' //this setup clears out the form values as it is the parent component of both form views
})(SurveyNew);