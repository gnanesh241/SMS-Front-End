import { SignUp } from "@clerk/nextjs";

const page = () => {
    return(
    <div className="flex items-center justify-center h-screen">
        <div className="p-4 rounded">
            <SignUp path="/sign-up"/>
        </div>
    </div>
    )
}

export default page;