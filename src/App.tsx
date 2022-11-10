import { useEffect, useState, useCallback, Fragment } from "react";
import "./App.css";
import RepoInfo from "./RepoInfo";
import github from "./db";
import query from "./Query";
import SearchBox from "./components/SearchBox";
import NavButtons from "./components/NavButtons";

function App() {
  let [username, setUsername] = useState("");
  let [repoList, setRepoList] = useState([]);
  let [loading, setLoading] = useState(false);
  let [pageCount, setPageCount] = useState("10");
  let [queryString, setQueryString] = useState("");
  let [totalCount, setTotalCount] = useState("1");

  let [startCursor, setStartCursor] = useState(null);
  let [endCursor, setEndCursor] = useState(null);
  let [hasPreviousPage, setHasPreviousPage] = useState(false);
  let [hasNextPage, setHasNextPage] = useState(true);
  let [paginationKeyword, setpaginationKeyword] = useState("first");
  let [paginationString, setPaginationString] = useState("");

  const fetchData = useCallback(() => {
    const queryText = JSON.stringify(
      query(pageCount, queryString, paginationKeyword, paginationString)
    );
    fetch(github.baseURL, {
      method: "POST",
      headers: github.headers,
      body: queryText,
    })
      .then((response) => response.json())
      .then((data) => {
        const viewer = data.data.viewer;
        const repos = data.data.search.edges;
        const total = data.data.search.repositoryCount;

        const start = data.data.search.pageInfo?.startCursor;
        const end = data.data.search.pageInfo?.endCursor;
        const next = data.data.search.pageInfo?.hasNextPage;
        const prev = data.data.search.pageInfo?.hasPreviousPage;

        setUsername(viewer.name);
        setRepoList(repos);
        setTotalCount(total);

        setStartCursor(start);
        setEndCursor(end);
        setHasPreviousPage(prev);
        setHasNextPage(next);

        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [pageCount, queryString, paginationKeyword, paginationString]);

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, [fetchData]);

  return (
    <div className="App container mt-5">
      <h1 className="text-primary">
        <i className="bi bi-diagram-2-fill"></i>
        Repos
      </h1>
      {loading ? (
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        repoList && (
          <Fragment>
            <p>Hey there {username}</p>
            <SearchBox
              totalCount={totalCount}
              pageCount={pageCount}
              queryString={queryString}
              onTotalChange={(myNumber: string) => {
                setTotalCount(myNumber);
              }}
              onQueryChange={(myString: string) => {
                setQueryString(myString);
              }}
            />
            
            <ul className="list-group list-group-flush">
              {repoList.map((repo: any) => (
                <RepoInfo key={repo.node.id} repo={repo.node} />
              ))}
            </ul>

            <NavButtons
              start={startCursor}
              end={endCursor}
              next={hasNextPage}
              previous={hasPreviousPage}
              onPage={(myKeyword: string, myString: string) => {
                setpaginationKeyword(myKeyword);
                setPaginationString(myString);
              }}
            />
          </Fragment>
        )
      )}
    </div>
  );
}

export default App;
