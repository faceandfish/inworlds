import Link from "next/link";

const AuthButtons = () => {
  return (
    <div>
      <Link
        href="/register"
        className="  pb-1 mr-10 font-light 
    hover:border-b hover:border-b-black transition duration-500 ease-in-out"
      >
        Register
      </Link>
      <Link
        href="/login"
        className=" font-light pb-1 hover:border-b hover:border-b-black transition duration-500 ease-in-out"
      >
        Login
      </Link>
    </div>
  );
};
export default AuthButtons;
