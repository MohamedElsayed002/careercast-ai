import { EditUser } from "@/components/edit-user"
import { requireAuth } from "@/utils/auth-utils"


const EditUserPage = async () => {
    await requireAuth()
    return (
        <div>
            <EditUser/>
        </div>
    )
}


export default EditUserPage