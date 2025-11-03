import { LoginForm } from "@/components/login-form"
import { requireUnAuth } from "@/utils/auth-utils"


const SignInPage =async  () => {
    await requireUnAuth()
    return (
        <>
            <LoginForm/>
        </>
    )
}

export default SignInPage