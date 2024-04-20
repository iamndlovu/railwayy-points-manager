import React from 'react';

const ReportCard = ({ data = {} }) => {
  const { header, tableItems } = data;

  return Object.keys(data).length > 0 ? (
    <article>
      <table className={`article-container center column`}>
        <thead className={`article-header center column`}>
          <tr className={`center column`}>
            <td className='text-center'>
              <h3>{header}</h3>
            </td>
          </tr>
        </thead>
        <tbody>
          {tableItems &&
            tableItems.map(({ key, value, indicator }) => (
              <tr key={header + key + value + indicator}>
                <td>{key}:</td>
                <td>
                  <span>{value}</span>
                  {indicator && <span className={indicator}></span>}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </article>
  ) : (
    <article style={{ background: 'transparent' }}>
      <table className={`article-container center column`}>
        <thead className={`article-header center column`}>
          <tr className={`center column`}>
            <td className='text-center' style={{ borderColor: 'transparent' }}>
              <h3>{header}</h3>
            </td>
          </tr>
        </thead>
        <tbody>
          {tableItems &&
            tableItems.map(({ key, value, indicator }) => (
              <tr key={header + key + value + indicator}>
                <td>{key}:</td>
                <td>
                  <span>{value}</span>
                  {indicator && <span className={indicator}></span>}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </article>
  );
};

export default ReportCard;
