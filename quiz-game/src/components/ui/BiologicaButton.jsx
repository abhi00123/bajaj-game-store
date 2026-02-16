import * as React from "react";
import { cn } from "../../lib/utils";

const BiologicaButton = React.forwardRef(({
    className,
    children,
    selected = false,
    title,
    subtitle,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                // Base styles
                "relative flex flex-col items-center justify-center px-6 py-4 min-h-[80px]",
                "rounded-full border border-gray-300 bg-[#FAFAF8]",
                "text-charcoal font-medium transition-all duration-200 ease-out",
                "shadow-sm hover:shadow-md hover:bg-[#F5F5F3]",
                "focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
                // Selected state
                selected && "bg-[#EDEDEB] border-gray-400 shadow-inner",
                className
            )}
            {...props}
        >
            {title && <span className="text-sm font-semibold text-gray-800">{title}</span>}
            {subtitle && <span className="text-xs text-gray-500 mt-1">{subtitle}</span>}
            {!title && !subtitle && children}
        </button>
    );
});

BiologicaButton.displayName = "BiologicaButton";

export { BiologicaButton };
