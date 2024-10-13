import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <>
      <Link href="/">
        <div className="w-20 md:w-32">
          <Image
            src="/inworlds.png"
            alt="logo"
            width={1231}
            height={280}
            style={{ objectFit: "cover" }}
          />
        </div>
      </Link>
    </>
  );
};
export default Logo;
