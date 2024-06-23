
export const RegistrationDefaultValue = {
    /*
    * Sets default values for registration the new user.
    */
    async RegistrationDefaultCreateValue () {
        return {
            createdAt: new Date().toISOString()
        }
    }
}


