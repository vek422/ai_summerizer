import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article.js";
const Demo = () => {
  const [article, setArticle] = useState({ url: "", summary: "" });
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  const [allArticles, setAllArticles] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("....");
    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      setArticle(newArticle);
      const updatedOldArticles = [newArticle, ...allArticles];
      setAllArticles(updatedOldArticles);
      console.log(newArticle);

      localStorage.setItem("articles", JSON.stringify(updatedOldArticles));
    }
  };

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles"),
    );
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  return (
    <section className="mt-16 w-full max-w-xl ">
      {/* Search */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt={"linkIcon"}
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter Your URL"
            value={article.url}
            onChange={(e) => {
              setArticle((pre) => ({ ...pre, url: e.target.value }));
            }}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <p>↵</p>
          </button>
        </form>
        {/* Browse URL History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((article, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(article)}
              className="link_card"
            >
              <div className="copy_btn">
                <img
                  src={copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain "
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-small truncate">
                {article.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Display Result */}
      <div className="my-8 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="h-20 w-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, That Wasnt Suppose to Happen <br />
            <span className="font-satoshi text-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>{" "}
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
