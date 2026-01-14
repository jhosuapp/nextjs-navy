import Lenis from "lenis";

const anchorScroll = (target: Lenis | Window | null) => {
    if (!target) return;

    requestAnimationFrame(() => {
        if (target instanceof Lenis) {
            target.scrollTo("bottom", { duration: 1 });
        } else {
            target.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        }
    });
}

export { anchorScroll }