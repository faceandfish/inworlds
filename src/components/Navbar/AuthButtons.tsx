import Link from "next/link";
import { useTranslation } from "../useTranslation";
import MenuLanguageOption from "./MenuLanguageOption";

interface AuthButtonsProps {
  isMobile: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile }) => {
  const { t, lang } = useTranslation("navbar");

  if (isMobile) {
    return (
      <div className="flex justify-around items-center w-full">
        <MenuLanguageOption variant="mobile" />
        <Link
          href={`/${lang}/register`}
          className="py-3 text-center shadow-md border px-5 text-neutral-600 rounded-md"
        >
          {t("register")}
        </Link>
        <Link
          href={`/${lang}/login`}
          className="py-3 text-center px-5 shadow-md text-white bg-orange-400 rounded-md"
        >
          {t("login")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <MenuLanguageOption variant="auth-desktop" />
      <Link
        href={`/${lang}/register`}
        className="pb-1 font-light hover:border-b hover:border-b-black transition duration-500 ease-in-out"
      >
        {t("register")}
      </Link>
      <Link
        href={`/${lang}/login`}
        className="font-light pb-1 hover:border-b hover:border-b-black transition duration-500 ease-in-out"
      >
        {t("login")}
      </Link>
    </div>
  );
};

export default AuthButtons;
