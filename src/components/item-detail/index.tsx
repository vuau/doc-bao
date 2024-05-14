import { useQuery } from "@tanstack/react-query";
import { getPageInReaderView } from "../../api";

import { useSearchParams } from "react-router-dom";
import { ArrowUpRightSquare, Loader } from "lucide-react";
import { useEffect, useState } from "react";

function ItemDetail() {
  const [params] = useSearchParams();
  const url = params.get("url");
  const title = params.get("title");

  const { data: articleData, isInitialLoading } = useQuery({
    queryKey: ["itemDetailArticle", url],
    queryFn: () => getPageInReaderView(url as string),
  });

  const [lastScrollTop, setLastScrollTop] = useState(0);

  // hide dialog header when scroll down and show it when scroll up
  useEffect(() => {
    const dialogMain = document.querySelector(
      "div[data-reach-dialog-inner]",
    ) as HTMLDivElement;
    const dialogHeader = document.querySelector(
      ".dialog-header-container",
    ) as HTMLDivElement;

    const handleScroll = (e: Event) => {
      const scrollTop = (e.target as HTMLDivElement).scrollTop;
      if (scrollTop > lastScrollTop) {
        dialogHeader.style.top = "-80px";
      } else {
        dialogHeader.style.top = "0";
      }
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };
    dialogMain?.addEventListener("scroll", handleScroll);
    return () => dialogMain?.removeEventListener("scroll", handleScroll);
  }, [url, lastScrollTop]);

  return (
    <div className="article-wrap">
      <h2>
        <a href={url as string} target="_blank">
          {title} <ArrowUpRightSquare />
        </a>
      </h2>
      {isInitialLoading && (
        <div className="loader">
          Đang tải...
          <Loader />
        </div>
      )}
      <div
        className="article"
        dangerouslySetInnerHTML={{
          __html: articleData as string,
        }}
      />
    </div>
  );
}

export default ItemDetail;
