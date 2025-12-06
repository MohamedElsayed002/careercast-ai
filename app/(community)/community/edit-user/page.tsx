import { EditUser } from "@/components/edit-user"
import { requireAuth } from "@/utils/auth-utils"

export const metadata: Metadata = {
  title: "CustomCareer AI | Edit User",
  description: "Edit user!"
};


const EditUserPage = async () => {
    await requireAuth()
    return (
        <div>
            <EditUser/>
        </div>
    )
}


export default EditUserPage