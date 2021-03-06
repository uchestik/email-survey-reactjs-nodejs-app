//regular expression from emailregex.com
const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default (emails)=>{
    const invalidEmails = emails.split(',')
        .map(email=>email.trim())
        .filter(email=>re.test(email) === false) //we want to return the emails that fail

        if(invalidEmails.length){
            return `These emails are invalid:${invalidEmails}`
        }

        return;
};