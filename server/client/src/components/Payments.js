import React,{Component} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import {connect} from 'react-redux'
import * as actions from '../actions'

//this component helps us transition or render the 
//stripe api user interface for our application.
//however we need to make a couple configurations
class Payments extends Component{
    
    render(){
        return (
            <StripeCheckout 
                name='Emaily'
                description='$5 for 5 email credits'
                amount={500} //amounts is in cents
                token={token => this.props.handleToken(token)} //callback function after retrieving authorization token 
                stripeKey={process.env.REACT_APP_STRIPE_KEY}
            >
            <button className='btn'>Add Credits </button> 
            </StripeCheckout>
        )
    }
}

export default connect(null,actions)(Payments);