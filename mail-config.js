const config = require('./config');

/*add all the necessary mail bodies here*/
var mailBodies = {

    'WELCOME' : (params)=>{

                return `<h1>Welcome to Witverse!</h1>
                 <h4>we are happy to have you here</h4>
                 <p>Your temporary password is <strong> ${params.randPass} </strong> </p>
                 <ul>
                 <li> <strong>step 1</strong> : Login with your temporary password</li>
                 <li> <strong>step 2</strong> : Change your password in profile section</li>
                 <li> <strong>step 3</strong> : Enjoy using Witverse</li>
                 </ul>
                 <small>All rights reserved Witverse 2020 - Developed by Ajay Panthagani</small>`
    }
}

exports.mailEnvelope = (mail_type, subject, params) =>{

    /*mail configuration envelope*/
    const envelope = {
                        from : `"${config.APPLICATION_NAME}" <${config.MAIL_ID}>`, // sender address
                        to : params.toEmail, // list of receivers
                        subject : subject, // Subject line
                        html : mailBodies[mail_type](params), // html body
                    }

    return envelope;
}