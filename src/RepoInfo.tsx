export default function RepoInfo({ repo }: any) {
  let license;

  switch (repo.licenseInfo?.spdxId) {
    case undefined:
        license = (
          <span className="px-1 py-0 ms-1 btn btn-sm btn-danger" style={{fontSize: ".6m"}}>NO LICENSE</span>
        )
      break;
      
    case "NOASSERTION":
        license = (
          <span className="px-1 py-0 ms-1 btn btn-sm btn-warning" style={{fontSize: ".6m"}}>{repo.licenseInfo.spdxId}</span>
        )
      break;
  
    default:
      license = (
        <span className="px-1 py-0 ms-1 btn btn-sm btn-warning" style={{fontSize: ".6m"}}>{repo.licenseInfo.spdxId}</span>
      )
      break;
  }
  return (
    <li key={repo.id.toString()} className="list-group-item">
      <div className="d-flex justify-content-between align-item-center">
        <div className="d-flex flex-column">
          <a className="h5 mb-0 text-decoration-none" href={repo.url}>
            {repo.name}
          </a>
          <p className="small">{repo.description}</p>
        </div>
        <div className="text-nowrap ms-3">
            { license }
        <span className={
            "px-1 py-0 ms-1 align-self-center btn btn-sm " +
            (repo.viewerSubscription === "SUBSCRIBED" ? "btn-success" : "btn-outline-secondary")
        }>
            {repo.viewerSubscription}
        </span>
        </div>
      </div>
    </li>
  );
}
