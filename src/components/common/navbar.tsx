const Navbar = () => {
    return (
        <>
            <div
                className="flex items-center justify-between bg-white border-b border-gray-200 w-full    h-[103px] px-[42px] pt-6 pb-[25px]"
            >
                <div />
                <div
                    className="flex flex-col justify-center items-start bg-white w-[168px] h-[54px] rounded-full px-5 border border-white shadow-[8px_8px_28px_0px_#9E9D9B47]"
                >
                    <span
                        className="font-medium text-[16px] leading-[1] tracking-[0.4px] text-black font-[Afacad,sans-serif]"
                    >
                        Zeeshan Infiniti
                    </span>
                    <span
                        className="font-normal text-[14px] leading-[1] text-gray-500 font-[Afacad,sans-serif]"
                    >
                        abc@gmail.com
                    </span>
                </div>
            </div>
            {/* Horizontal line under navbar */}
            <div className="w-full border-b border-gray-100" />
        </>
    )
}

export default Navbar
