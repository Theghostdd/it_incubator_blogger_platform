

export const RegistrationDto = {
    RegistrationUserData: {
        login: "SomeLogin",
        email: "Some@mail.ru",
        password: "somePassword"
    },
}

export const AuthDto = {
    AuthUserData: {
        loginOrEmail: RegistrationDto.RegistrationUserData.login,
        password: RegistrationDto.RegistrationUserData.password
    }
}

export const BlogDto = {
    CreateBlogData: {
        name: "My Blog",
        description: "This is my blog",
        websiteUrl: "https://my-blog.ru"
    }
}

export const InsertDto = {
    UserInsertData: {
        login: RegistrationDto.RegistrationUserData.login,
        email: RegistrationDto.RegistrationUserData.email,
        password : "$2b$10$tzPK5PtrGzA0IPQzPqIXcOE.EBYOD3ixLV9Ctc.J7vuJg1TmWGFg2",
        userConfirm : {
            ifConfirm : true,
            confirmationCode : "d8db4fa0-94bd-41dd-8d60-833322e02925",
            dataExpire : "2024-07-06T13:41:33.211Z"
        },
        createdAt : "2024-07-05T13:41:33.220Z"
    },
}