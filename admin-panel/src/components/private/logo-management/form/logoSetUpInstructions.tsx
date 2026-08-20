const LogoSetUpInstructions = () => {
  return (
    <div className="bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-400 p-4 mb-4 rounded-md">
      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
        Important Instructions for Logo Setup:
      </h3>
      <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
        <li>
          This API automatically fetches logos for <strong>all stocks</strong>{" "}
          available in the stock list from a third-party API.
        </li>
        <li>
          Each fetched logo is uploaded to <strong>Amazon S3</strong>, and its
          public URL is stored in the database under the respective stock entry.
        </li>
        <li>
          The logo is saved in S3 using a structured <strong>filename</strong>{" "}
          format for easier identification and retrieval.
        </li>
        <li>
          After processing, the API returns a list of symbols for which the logo{" "}
          <strong>could not be set</strong>.
        </li>
        <li>
          Ensure that all stocks in the list have valid and recognizable{" "}
          <strong>symbols</strong> — missing or invalid ones may prevent logo
          fetching.
        </li>
        <li>
          The operation may take some time depending on the number of stocks
          being processed.
        </li>
        <li>
          It will also return a <strong>log</strong> containing the list of
          symbols that failed to fetch a logo.
        </li>
      </ul>
    </div>
  );
};

export default LogoSetUpInstructions;
