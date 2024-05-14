import { CSSProperties, useRef, useCallback } from "react";
import { VariableSizeList } from "react-window";
import { useQuery } from "@tanstack/react-query";
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Loader } from "lucide-react";
import Item from "../item";
import { Dialog } from "@reach/dialog";
import ItemDetail from "../item-detail";
import { ArrowLeft } from "lucide-react";
import { decode } from "html-entities";

interface RSSItem {
  title: string;
  url: string;
  id: string;
  site: string;
}

async function parseRSS(site: string, url: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(url, { mode: "no-cors" });
    const xml = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const items = xmlDoc.querySelectorAll("item");

    const parsedItems: RSSItem[] = [];
    items.forEach((item) => {
      parsedItems.push({
        title: decode(item.querySelector("title")?.textContent || ""),
        url: item.querySelector("link")?.textContent || "",
        id: item.querySelector("link")?.textContent || "",
        site,
      });
    });
    return parsedItems;
  } catch (error) {
    console.error("Error fetching or parsing RSS:", error);
    return [];
  }
}

const rowHeights: {
  [index: number]: number;
} = {};

function setItemSize(index: number, height: number): void {
  rowHeights[index] = height || 30;
}

function getItemSize(index: number): number {
  return rowHeights[index] || 30;
}

const feeds: Record<string, Array<[string, string]>> = {
  "trang-chu": [
    ["vnexpress", "vnexpress.net/rss/tin-moi-nhat.rss"],
    ["tuoitre", "tuoitre.vn/rss/tin-moi-nhat.rss"],
    ["thanhnien", "thanhnien.vn/rss/home.rss"],
  ],
  "thoi-su": [
    ["vnexpress", "vnexpress.net/rss/thoi-su.rss"],
    ["tuoitre", "tuoitre.vn/rss/thoi-su.rss"],
    ["thanhnien", "thanhnien.vn/rss/thoi-su.rss"],
  ],
  "the-gioi": [
    ["vnexpress", "vnexpress.net/rss/the-gioi.rss"],
    ["tuoitre", "tuoitre.vn/rss/the-gioi.rss"],
    ["thanhnien", "thanhnien.vn/rss/the-gioi.rss"],
  ],
  "kinh-te": [
    ["vnexpress", "vnexpress.net/rss/kinh-doanh.rss"],
    ["tuoitre", "tuoitre.vn/rss/kinh-doanh.rss"],
    ["thanhnien", "thanhnien.vn/rss/kinh-te.rss"],
  ],
  "giao-duc": [
    ["vnexpress", "vnexpress.net/rss/giao-duc.rss"],
    ["tuoitre", "tuoitre.vn/rss/giao-duc.rss"],
    ["thanhnien", "thanhnien.vn/rss/giao-duc.rss"],
  ],
  "giai-tri": [
    ["vnexpress", "vnexpress.net/rss/giai-tri.rss"],
    ["tuoitre", "tuoitre.vn/rss/giai-tri.rss"],
    ["thanhnien", "thanhnien.vn/rss/giai-tri.rss"],
  ],
  "phap-luat": [
    ["vnexpress", "vnexpress.net/rss/phap-luat.rss"],
    ["tuoitre", "tuoitre.vn/rss/phap-luat.rss"],
    ["thanhnien", "thanhnien.vn/rss/phap-luat.rss"],
  ],
  "doi-song": [
    ["vnexpress", "vnexpress.net/rss/doi-song.rss"],
    ["tuoitre", "tuoitre.vn/rss/doi-song.rss"],
    ["thanhnien", "thanhnien.vn/rss/doi-song.rss"],
  ],
  "goc-nhin": [
    ["vnexpress", "vnexpress.net/rss/goc-nhin.rss"],
    ["tuoitre", "tuoitre.vn/rss/ban-doc-lam-bao.rss"],
    ["thanhnien", "thanhnien.vn/rss/toi-viet.rss"],
  ],
  "tam-su": [["vnexpress", "vnexpress.net/rss/tam-su.rss"]],
  "cong-nghe": [
    ["vnexpress", "vnexpress.net/rss/so-hoa.rss"],
    ["tuoitre", "tuoitre.vn/rss/nhip-song-so.rss"],
    ["thanhnien", "thanhnien.vn/rss/cong-nghe-game.rss"],
  ],
};

function List() {
  const listRef = useRef<VariableSizeList>(null);
  const navigate = useNavigate();
  const { tag } = useParams();
  const [params] = useSearchParams();
  const url = params.get("url");
  if (!tag) {
    navigate("/doc-bao/thoi-su");
  }
  const { data, isLoading } = useQuery({
    queryKey: ["stories", tag],
    queryFn: async () => {
      if (!tag) return [];
      return Promise.all(
        feeds[tag].map(async ([site, feed]) => parseRSS(site, `/${feed}`)),
      ).then((values) => values.flat());
    },
    refetchOnWindowFocus: false,
  });

  function ItemRenderer({
    style,
    index,
  }: {
    style: CSSProperties;
    index: number;
  }) {
    if (!data) return null;
    return (
      <Item
        style={style}
        index={index}
        setItemSize={setItemSize}
        listRef={listRef}
        data={data[index] as RSSItem}
      />
    );
  }

  const close = useCallback(() => {
    navigate(`/doc-bao/${tag}`);
  }, [navigate, tag]);

  return (
    <>
      <header>
        <nav>
          <NavLink to="/doc-bao/thoi-su">Thời sự</NavLink>
          <NavLink to="/doc-bao/the-gioi">Thế giới</NavLink>
          <NavLink to="/doc-bao/kinh-te">Kinh tế</NavLink>
          <NavLink to="/doc-bao/giao-duc">Giáo dục</NavLink>
          <NavLink to="/doc-bao/phap-luat">Pháp luật</NavLink>
          <NavLink to="/doc-bao/doi-song">Đời sống</NavLink>
          <NavLink to="/doc-bao/cong-nghe">Công nghệ</NavLink>
          <NavLink to="/doc-bao/giai-tri">Giải trí</NavLink>
          <NavLink to="/doc-bao/goc-nhin">Góc nhìn</NavLink>
          <NavLink to="/doc-bao/tam-su">Tâm sự</NavLink>
        </nav>
      </header>
      {isLoading && (
        <div
          className="loader"
          style={{
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      )}
      {data && (
        <VariableSizeList
          ref={listRef}
          itemCount={data.length}
          height={window.innerHeight - 60}
          width="100%"
          itemSize={getItemSize}
        >
          {ItemRenderer}
        </VariableSizeList>
      )}
      {url && (
        <Dialog isOpen onDismiss={close}>
          <div className="dialog-header-container">
            <div className="dialog-header">
              <button className="header-button" onClick={close}>
                <ArrowLeft />
                <span>Trở lại</span>
              </button>
            </div>
          </div>
          <ItemDetail />
        </Dialog>
      )}
    </>
  );
}
export default List;
