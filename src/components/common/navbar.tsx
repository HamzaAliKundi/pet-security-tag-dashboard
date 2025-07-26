import { useGetSingleUserQuery } from "../../apis/user/users";

const Navbar = () => {
  // @ts-ignore
  const { data: userData, isLoading: isLoadingUser, error: userError } = useGetSingleUserQuery();

  return (
    <>
      <div className="flex items-center justify-between bg-white border-b border-gray-200 w-full h-[103px] px-[42px] pt-6 pb-[25px]">
        <div />
        <div className="flex flex-col justify-center items-start bg-white w-[168px] h-[54px] rounded-full px-5 border border-white shadow-[8px_8px_28px_0px_#9E9D9B47]">
          {isLoadingUser ? (
            // Loader
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <span className="font-medium text-[16px] leading-[1] tracking-[0.4px] text-black font-[Afacad,sans-serif]">
                {userData?.user?.firstName}
              </span>

              {/* Email with truncation and tooltip */}
              <span className="font-normal text-[14px] leading-[1] text-gray-500 font-[Afacad,sans-serif] relative group cursor-default w-full max-w-full">
                <span className="inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {userData?.user?.email?.length > 15
                    ? `${userData?.user?.email.slice(0, 15)}...`
                    : userData?.user?.email}
                </span>

                {/* Tooltip */}
                <span className="absolute z-10 left-0 top-[110%] w-max max-w-[250px] px-2 py-1 bg-gray-800 text-white text-[12px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {userData?.user?.email}
                </span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Horizontal line under navbar */}
      <div className="w-full border-b border-gray-100" />
    </>
  );
};

export default Navbar;
