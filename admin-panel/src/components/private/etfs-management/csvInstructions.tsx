const CsvInstructions = () => {
  return (
    <div className="bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-400 p-4 mb-4 rounded-md">
      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
        Notes:
      </h3>

      <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
        <li>
          The uploaded CSV file must contain all the stock entries you want to
          include.
        </li>

        <li>
          Uploading a new CSV will{" "}
          <strong>remove all existing stock data</strong> and replace it with
          the data from the uploaded file.
        </li>

        <li>
          Upload <strong>CSV file only</strong> and ensure headers include{" "}
          <strong>SYMBOL</strong> and <strong>UNDERLYING ASSET</strong>{" "}
          (case-sensitive after cleanup).
        </li>

        <li>
          Each <strong>SYMBOL</strong> is validated against today’s instrument
          list. Missing or invalid symbols will be skipped and returned in the
          response.
        </li>

        <li>
          ETFs are <strong>upserted</strong> based on <strong>SYMBOL</strong> —
          existing records are updated and new ones are inserted automatically.
        </li>

        <li>
          ETF type (<strong>tp</strong>) is auto-detected from the symbol name:
          <strong> Gold</strong>, <strong>Silver</strong>, or{" "}
          <strong>Index</strong>.
        </li>

        <li>
          <strong>Partial success</strong> is supported — valid records are
          saved even if some symbols are not found.
        </li>

        <li>
          The CSV file is <strong>auto-deleted</strong> after processing — no
          manual cleanup is required.
        </li>
      </ul>
    </div>
  );
};

export default CsvInstructions;
