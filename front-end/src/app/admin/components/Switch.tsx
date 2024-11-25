function Switch({ visible, onToggle }: SwitchProps) {
    return (
        <div className="flex items-center">
            <div
                className={`relative w-[68px] h-[22px] flex rounded-sm bg-red-300 cursor-pointer text-white font-semibold text-xs`}
                onClick={() => onToggle(!visible)}
            >
                <div className="flex-1 flex justify-center items-center">
                    <span>Ẩn</span>
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <span>Hiện</span>
                </div>
                <div
                    className={`absolute top-[-1px] left-[-1px] h-[24px] w-[34px] rounded-sm border
                        border-[#D9D9D9]
                        bg-white shadow-[0_1px_8px_0_rgba(165,163,174,0.60)] transform transition-transform ${
                            visible ? 'translate-x-[36px]' : 'translate-x-[-1px]'
                        }`}
                ></div>
            </div>
        </div>
    );
}

export default Switch;
