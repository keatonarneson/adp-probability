import { useState, useEffect } from 'react';
import './App.css';
import Papa from 'papaparse';
import NormalDistribution from 'normal-distribution';
import csv from './static/adp-probability.tsv';
import DraftSlots from './DraftSlots';

function App() {
  const [rows, setRows] = useState(null);
  const [draftSlot, setDraftSlot] = useState(1);
  const [draftToggle, setDraftToggle] = useState(false);

  const probability = (mean, standardDeviation, draftSlot) => {
    const normDist = new NormalDistribution(mean, standardDeviation);

    return 1 - normDist.cdf(draftSlot);
  };

  const handleChange = e => {
    setDraftSlot(e.target.value);
  };

  // Prevent Enter Key from reloading the page
  const onKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleClick = e => {
    setDraftToggle(!draftToggle);
  };

  useEffect(() => {
    Papa.parse(csv, {
      download: true,
      header: true,
      complete: data => {
        setRows(data);
      },
    });
  }, []);

  return (
    <div className="container">
      <header>
        <h1>ADP Probability of Availability</h1>
        <p>NFBC 12-team Online Championship ADP</p>
        <small>
          <em>All drafts up to 2-24-2021</em>
        </small>
      </header>
      {draftToggle && <DraftSlots />}

      <button onClick={handleClick}>Toggle Draft Pick Table</button>
      <form>
        <label>Draft Slot</label>
        <input
          type="number"
          min="1"
          value={draftSlot}
          onChange={handleChange}
          onKeyDown={onKeyDown}
        />
      </form>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {rows?.meta.fields.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.data.map((row, index) => (
              <tr key={index}>
                <td>{row.Rank}</td>
                <td>{row.Player}</td>
                <td>{row.Team}</td>
                <td>{row.Position}</td>
                <td>{row.ADP}</td>
                <td>{row.Min_Pick}</td>
                <td>{row.Max_Pick}</td>
                <td>{row.Difference}</td>
                <td>{row.StDev}</td>
                <td>{draftSlot}</td>
                <td>
                  <strong>
                    {(probability(row.ADP, row.StDev, draftSlot) * 100).toFixed(
                      2
                    ) + '%'}
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
