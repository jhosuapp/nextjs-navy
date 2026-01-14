import { useState } from "react";

const useLoadMore = (items: any[], step = 6) => {
    const [visible, setVisible] = useState(step);

    return {
        visibleItems: items.slice(0, visible),
        hasMore: visible < items.length,
        loadMore: () => setVisible(v => v + step),
    };
};

export { useLoadMore }