const AllDataInstruction = () => {
  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-400 p-4 mb-4 rounded-md">
      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
        Important Instructions:
      </h3>
      <ul className="list-disc list-inside text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
        <li>
          Please verify today’s access token from Zerodha before calling this
          API to avoid failure.
        </li>
        <li>
          This will delete <strong>not</strong> all historical data
        </li>
        <li>
          This will just start he insertion of all the data, as db will only
          update the data with same timestamp, sk for listed Stocks, Index,
          Futures, Options re-insert it into the database.
        </li>
        <li>
          Equity (Cash) data is fetched for the <strong>last 24 months</strong>{" "}
          on a <strong>month-wise basis</strong>.
        </li>
        <li>
          For F&amp;O symbols, historical data is fetched based on{" "}
          <strong>expiry position</strong>:
          <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
            <li>
              Current expiry → <strong>last 2 months</strong>
            </li>
            <li>
              Other expiries → <strong>last 1 month</strong>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default AllDataInstruction;
