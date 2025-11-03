import { RegisterForm } from "@/components/register-form"
import { requireUnAuth } from "@/utils/auth-utils"


const SignUpPage = async () => {
    await requireUnAuth()
    return (
        <><RegisterForm/></>
    )
}

export default SignUpPage