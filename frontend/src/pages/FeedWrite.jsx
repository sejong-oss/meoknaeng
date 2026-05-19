import { useEffect } from "react";
import { SITE_NAME } from "@/lib/constants.js";

export default function FeedWrite() {
    useEffect(() => { document.title = `${SITE_NAME} | 레시피 작성`; }, []);

    return <div>레시피 공유 작성</div>;
}
