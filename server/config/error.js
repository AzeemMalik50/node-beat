// Error messages 

module.exports = {
    missingRequiredHeader: {
        error: true,
        message: "A required HTTP header was not specified.",
        statusCode: 400
    },
    missingRequiredQueryParameter: {
        error: true,
        message: "A required query parameter was not specified for this request.",
        statusCode: 400
    },
    inValidEmail: {
        error: true,
        message: "The given email is not valid.",
        statusCode: 400
    },
    authenticationFail: {
        error: true,
        message: "The given email or password is not valid.",
        statusCode: 400        
    },
    unAuthorized: {
        error: true,
        message: "You are not authorized to access this.",
        statusCode: 401                
    },
    forbidden: {
        error: true,
        message: "You are forbidden to access this.",
        statusCode: 403                
    },
    accountIsDisabled: {
        error: true,
        message: "The specified account is disabled.",
        statusCode: 403
    },
    accountAlreadyExists: {
        error: true,
        message: "The specified account already exists.",
        statusCode: 409
    },
    resourceAlreadyExists: {
        error: true,
        message: "The specified resource already exists.",
        statusCode: 409
    },
    notFound: {
        error: true,
        message: "The specified resource does not exist.",
        statusCode: 404
    },
    internalServerError: {
        error: true,
        message: "The server encountered an internal error. Please retry the request.",
        statusCode: 500
    }
    
};