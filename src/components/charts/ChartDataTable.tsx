/**
 * The tabular reading of a chart, rendered for assistive technology only.
 *
 * Every chart ships one: a plot conveys shape, but the underlying numbers must
 * stay reachable without sight and without colour.
 */
export function ChartDataTable({
  caption,
  categoryHeader = 'Category',
  valueHeader = 'Value',
  rows,
}: {
  caption: string;
  categoryHeader?: string;
  valueHeader?: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <table className='sr-only'>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope='col'>{categoryHeader}</th>
          <th scope='col'>{valueHeader}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope='row'>{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
