import { SignIn } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 rounded">
        <SignIn path="/sign-in" />
      </div>
    </div>
  );
};

export default page;
