import { addSeconds } from "date-fns"

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
    },
    RequestData: {
        ip: '191.1.1.1',
        url: '/api/auth/login',
        date: addSeconds(new Date().toISOString(), 10),
        quantity: 1
    }
}


export const InsertAuthDto = {
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

    CreateManyData: [
        {
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

        {
            login: RegistrationDto.RegistrationUserData.login + '2',
            email: RegistrationDto.RegistrationUserData.email + '2',
            password : "$2b$10$tzPK5PtrGzA0IPQzPqIXcOE.EBYOD3ixLV9Ctc.J7vuJg1TmWGFg2",
            userConfirm : {
                ifConfirm : true,
                confirmationCode : "d8db4fa0-94bd-41dd-8d60-833322e02925",
                dataExpire : "2024-07-06T13:41:33.211Z"
            },
            createdAt : "2024-07-05T13:41:33.220Z"
        },

        {
            login: RegistrationDto.RegistrationUserData.login + '3',
            email: RegistrationDto.RegistrationUserData.email + '3',
            password : "$2b$10$tzPK5PtrGzA0IPQzPqIXcOE.EBYOD3ixLV9Ctc.J7vuJg1TmWGFg2",
            userConfirm : {
                ifConfirm : true,
                confirmationCode : "d8db4fa0-94bd-41dd-8d60-833322e02925",
                dataExpire : "2024-07-06T13:41:33.211Z"
            },
            createdAt : "2024-07-05T13:41:33.220Z"
        },

        {
            login: RegistrationDto.RegistrationUserData.login + '4',
            email: RegistrationDto.RegistrationUserData.email + '4',
            password : "$2b$10$tzPK5PtrGzA0IPQzPqIXcOE.EBYOD3ixLV9Ctc.J7vuJg1TmWGFg2",
            userConfirm : {
                ifConfirm : true,
                confirmationCode : "d8db4fa0-94bd-41dd-8d60-833322e02925",
                dataExpire : "2024-07-06T13:41:33.211Z"
            },
            createdAt : "2024-07-05T13:41:33.220Z"
        },

        {
            login: RegistrationDto.RegistrationUserData.login + '5',
            email: RegistrationDto.RegistrationUserData.email + '5',
            password : "$2b$10$tzPK5PtrGzA0IPQzPqIXcOE.EBYOD3ixLV9Ctc.J7vuJg1TmWGFg2",
            userConfirm : {
                ifConfirm : true,
                confirmationCode : "d8db4fa0-94bd-41dd-8d60-833322e02925",
                dataExpire : "2024-07-06T13:41:33.211Z"
            },
            createdAt : "2024-07-05T13:41:33.220Z"
        },

        {
            login: RegistrationDto.RegistrationUserData.login + '6',
            email: RegistrationDto.RegistrationUserData.email + '6',
            password : "$2b$10$tzPK5PtrGzA0IPQzPqIXcOE.EBYOD3ixLV9Ctc.J7vuJg1TmWGFg2",
            userConfirm : {
                ifConfirm : true,
                confirmationCode : "d8db4fa0-94bd-41dd-8d60-833322e02925",
                dataExpire : "2024-07-06T13:41:33.211Z"
            },
            createdAt : "2024-07-05T13:41:33.220Z"
        },

        {
            login: RegistrationDto.RegistrationUserData.login + '7',
            email: RegistrationDto.RegistrationUserData.email + '7',
            password : "$2b$10$tzPK5PtrGzA0IPQzPqIXcOE.EBYOD3ixLV9Ctc.J7vuJg1TmWGFg2",
            userConfirm : {
                ifConfirm : true,
                confirmationCode : "d8db4fa0-94bd-41dd-8d60-833322e02925",
                dataExpire : "2024-07-06T13:41:33.211Z"
            },
            createdAt : "2024-07-05T13:41:33.220Z"
        },

        {
            login: RegistrationDto.RegistrationUserData.login + '8',
            email: RegistrationDto.RegistrationUserData.email + '8',
            password : "$2b$10$tzPK5PtrGzA0IPQzPqIXcOE.EBYOD3ixLV9Ctc.J7vuJg1TmWGFg2",
            userConfirm : {
                ifConfirm : true,
                confirmationCode : "d8db4fa0-94bd-41dd-8d60-833322e02925",
                dataExpire : "2024-07-06T13:41:33.211Z"
            },
            createdAt : "2024-07-05T13:41:33.220Z"
        },

        {
            login: "Jon",
            email: 'jon@mai.ru',
            password : "$2b$10$tzPK5PtrGzA0IPQzPqIXcOE.EBYOD3ixLV9Ctc.J7vuJg1TmWGFg2",
            userConfirm : {
                ifConfirm : true,
                confirmationCode : "d8db4fa0-94bd-41dd-8d60-833322e02925",
                dataExpire : "2024-07-06T13:41:33.211Z"
            },
            createdAt : "2024-07-05T13:41:33.220Z"
        },

        {
            login: "Jon2",
            email: 'jon2@mai.ru',
            password : "$2b$10$tzPK5PtrGzA0IPQzPqIXcOE.EBYOD3ixLV9Ctc.J7vuJg1TmWGFg2",
            userConfirm : {
                ifConfirm : true,
                confirmationCode : "d8db4fa0-94bd-41dd-8d60-833322e02925",
                dataExpire : "2024-07-06T13:41:33.211Z"
            },
            createdAt : "2024-07-05T13:41:33.220Z"
        },

        {
            login: "Jon3",
            email: 'jon3@mai.ru',
            password : "$2b$10$tzPK5PtrGzA0IPQzPqIXcOE.EBYOD3ixLV9Ctc.J7vuJg1TmWGFg2",
            userConfirm : {
                ifConfirm : true,
                confirmationCode : "d8db4fa0-94bd-41dd-8d60-833322e02925",
                dataExpire : "2024-07-06T13:41:33.211Z"
            },
            createdAt : "2024-07-05T13:41:33.220Z"
        },
    ]
}