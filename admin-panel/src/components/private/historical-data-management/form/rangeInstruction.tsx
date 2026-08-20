const RangeInstruction = () => {
  return (
    <div className="bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-400 py-2 px-4 my-4 rounded-md">
      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
        Important Instructions for Insert by Range:
      </h3>

      <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
        <li>
          This API inserts historical market data (Equity + F&amp;O) using
          background tasks.
        </li>

        <li>
          If <strong>symbols</strong> are provided, historical data will be
          inserted <strong>only for those symbols</strong>.
        </li>

        <li>
          If a symbol exists in <strong>F&amp;O</strong>, its{" "}
          <strong>options chain historical data</strong> will also be inserted
          automatically.
        </li>

        <li>
          Equity (Cash) data is fetched for the <strong>last 24 months</strong>{" "}
          on a <strong>month-wise basis</strong>.
        </li>

        <li>
          Both <strong>minute</strong> and <strong>day</strong> timeframes are
          inserted for equity data and for FNO.
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

        <li>
          Symbols must exist in <strong>today’s instruments</strong>. Invalid or
          missing symbols will be skipped.
        </li>

        <li>
          Existing historical data for valid symbols will be{" "}
          <strong>deleted before reinsertion</strong>.
        </li>

        <li>
          This is a <strong>long-running background operation</strong>. The API
          responds immediately with a <strong>Job ID</strong>.
        </li>

        <li>
          Execution time depends on the number of symbols, expiries, and total
          generated tasks.
        </li>
      </ul>
    </div>
  );
};

export default RangeInstruction;
