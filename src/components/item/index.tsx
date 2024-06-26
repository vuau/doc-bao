import { CSSProperties, useEffect, useRef } from "react";
import { VariableSizeList } from "react-window";
import { Link, useParams } from "react-router-dom";
import { RSSItem } from "../../components/list";
import dayjs from "dayjs";

type TListProps = {
  index: number;
  style: CSSProperties;
  setItemSize: (index: number, height: number) => void;
  listRef: React.RefObject<VariableSizeList>;
  data: RSSItem;
};

function ListItem({
  style: itemStyle,
  index,
  setItemSize,
  listRef,
  data
}: TListProps) {
  const { tag = "top" } = useParams();

  const ref = useRef<HTMLDivElement>(null);

  const combinedStyle = {
    ...itemStyle,
  };

  useEffect(() => {
    if (ref.current && listRef?.current) {
      ref.current.style.height = "auto";
      setItemSize(index, ref.current.clientHeight);
      ref.current.style.height = `${ref.current.clientHeight}px`;
      listRef.current.resetAfterIndex(index);
    }
  }, [data, index, setItemSize, listRef]);

  if (data) {
    return (
      <div ref={ref} style={combinedStyle} className="item">
          <Link to={`/doc-bao/${tag}?url=${data.url}&title=${data.title}`}>
            {data.title}
            <span className="comment-count">
              { data.site } { dayjs(data.pubDate).format('DD/MM') }
            </span>
          </Link>
      </div>
    );
  } else {
    console.log("sth wrong", data);
    return <div style={combinedStyle}>sth wrong</div>;
  }
}

export default ListItem;
