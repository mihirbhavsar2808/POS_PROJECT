type Column = {
  Header: string;
  accessor: string;
};

type TableProps = {
  columns: Column[];
  data: Record<string, any>[];
};

const TableComp = ({ columns, data }:TableProps) => {

  return (
    <div className="rounded-t-xl shadow-md overflow-hidden ">
      <div className="max-h-[60vh] overflow-y-auto rounded-t-xl shadow-md scrollbar-hide">
        <table className="min-w-full text-sm  text-gray-700 text-left overflow-scroll">
          <thead className="bg-(--main) sticky top-0 text-white">
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} className="p-4  font-medium">
                  {col.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className="bg-white divide-y
          "
          >
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.accessor} className="p-4 border-b">
                    {col.accessor.toLowerCase() === "image" ? (
                      <img
                        src={row[col.accessor]}
                        alt="table-item"
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      row[col.accessor]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComp;