import { IoIosSearch } from "react-icons/io";
const SearchBar = () => {
  return (
    <>
      <form className="flex">
        <input
          className="border-orange-400 border
             w-80 h-10 px-6 focus:outline-none font-light rounded-tl-3xl rounded-bl-3xl"
          type="text"
          placeholder="search..."
        />
        <button className="flex items-center justify-center bg-orange-400 rounded-tr-3xl rounded-br-3xl hover:bg-orange-500 h-10 w-14 ">
          <IoIosSearch className="text-2xl text-white" />
        </button>
      </form>
    </>
  );
};
export default SearchBar;
