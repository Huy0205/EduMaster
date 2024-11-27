function BorderWrapper({ children, title, classes = '' }: BorderWrapperProps) {
    return (
        <div className={`w-full relative border-2 p-4 rounded-md ${classes}`}>
            <div className="absolute top-[-12px] left-[7px] bg-white px-1">
                <p className="font-semibold">{title}</p>
            </div>
            <>{children}</>
        </div>
    );
}

export default BorderWrapper;
