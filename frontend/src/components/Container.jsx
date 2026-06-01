export function Container({ children, className = "" }) {
    return (
        <div className={`max-w-360 mx-auto w-full px-4 md:px-7 ${className}`}>
            {children}
        </div>
    );
}
