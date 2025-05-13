import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [value, setValue] = useState([]);
  const [solution, setSolution] = useState([]);
  const [userValues, setUserValues] = useState([]);

  async function fetchSudokuSolution() {
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/sudokugenerate?difficulty=easy', {
        method: 'GET',
        headers: {
          'X-Api-Key': 'eNNGhjeghOiwSXT27DT4oQ==zQA18cLfYn2Ptick'
        }
      });

      const result = await response.json();
      console.log(result);
      if (result && result.puzzle) {
        setValue(result.puzzle);
        setSolution(result.solution);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    fetchSudokuSolution();
  }, []);

  
  useEffect(() => {
    if (value.length > 0) {
      setUserValues(value.map(row => row.map(cell => (cell === null ? '' : cell))));
    }
  }, [value]);

  
  const handleInputChange = (rowIndex, cellIndex, newValue) => {
    setUserValues(prevValues => {
      const updatedValues = prevValues.map(row => [...row]); 
      updatedValues[rowIndex][cellIndex] = newValue;
      return updatedValues;
    });
  };

  
  const handleSubmit = () => {
    if (!userValues.length) return;

    let isCorrect = true;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (value[row][col] === null) { 
          if (userValues[row][col] !== solution[row][col].toString()) {
            isCorrect = false;
            break;
          }
        }
      }
    }

    if (isCorrect) {
      alert(" Congratulations! You solved it correctly!");
    } else {
      alert(" Oops! Some values are incorrect. Try again!");
    }
  };

  return (
    <div className='flex justify-center items-center'>
      <div className="p-4">
        {value.length > 0 ? (
          <div>
            <table className="table-fixed border border-collapse">
              <tbody>
                {value.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((item, cellIndex) => (
                      <td key={cellIndex} className="border-r-2 border-b-2 p-2 text-center">
                        {item !== null ? (
                          item
                        ) : (
                          <input
                            type="number"
                            min="1"
                            max="9"
                            className="w-8 text-center outline-none"
                            value={userValues[rowIndex]?.[cellIndex] || ''}
                            onChange={(e) => handleInputChange(rowIndex, cellIndex, e.target.value)}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default App;