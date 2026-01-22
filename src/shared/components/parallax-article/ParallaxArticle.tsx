import clsx from "clsx";
import { forwardRef } from "react";

interface ParallaxArticleProps extends React.HTMLAttributes<HTMLDivElement> {
    visible?: boolean;
}

export const ParallaxArticle = forwardRef<HTMLDivElement, ParallaxArticleProps>(({ children, visible = false, ...props }, ref) => {
    const { className, style, ...rest } = props;
    const classes = clsx('absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto z-10', className);
    return (
        <article
            ref={ref}
            className={classes}
            style={visible ? style : { visibility: 'hidden', display: 'none', ...style }}
            {...rest}
        >
            {children}
        </article>
    )
})  