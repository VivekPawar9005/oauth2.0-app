function CustomMessages(){
this.authenticatedSuccessfully={
    code:200,
    status:'ok',
    message:'successfully user is authenticated.'
}

this.fetchedUsersSuccesfully={
    code:200,
    status:'ok',
    data:{}
}

this.tokenFetchedSuccessfully={
    code:200,
    status:'ok',
    data:{}
}

this.invalidCredentials={
    code:401,
    status:'invalid-access',
    message:''
}
this.fetchedUsersSuccesfully={
    code:200,
    status:'ok',
    data:{}
}
this.networkError={
    code:500,
    status:'network-error',
    message:'Network error encountered, please try again.'
}
this.successfullResponse={
    code:200,
    status:'ok',
    data:[]
} 
}

module.exports=CustomMessages;