import { useState } from 'react'
import { useSearch } from '@/hooks/use-search'

//icon
import { LuPlus, LuMinus } from 'react-icons/lu'

export default function CalculatePeople() {
  const { people, setPeople, addPeople, minusPeople } = useSearch()

  return (
    <>
      <div className="wrapper">
        <span className="title">選擇人數</span>
        <div className="line-wrapper">
          <span className="people-title">人數</span>
          <div className="calculate-wrapper">
            <button
              onClick={minusPeople}
              className="value-control"
              title="Decrease value"
              aria-label="Decrease value"
            >
              <LuMinus />
            </button>

            <input
              className="value-input"
              type="number"
              value={people}
              name="numberInput"
              id="numberInput"
              onChange={(e) => {
                setPeople(Number(e.target.value))
              }}
            />

            <button
              onClick={addPeople}
              className="value-control"
              title="Increase value"
              aria-label="Increase value"
            >
              <LuPlus />
            </button>
          </div>
        </div>
        <div className="btn-wrapper">
          <button className="compBtn">完成</button>
        </div>
      </div>
      <style jsx>
        {`
          input[type='number']::-webkit-inner-spin-button,
          input[type='number']::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .wrapper {
            background: var(--main-color-bright);
            width: 300px;
            height: 180px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            padding: 15px;
            justify-content: space-between;
          }
          .line-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--main-color-dark);
          }
          .calculate-wrapper {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          .title {
            font-family: 'Noto Sans TC';
            font-size: 16x;
            font-style: normal;
            font-weight: 700;
            padding-bottom: 10px;
          }
          .people-title {
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
          }
          .value-control {
            width: 30px;
            height: 30px;
            margin: 0 8px;
            background: transparent;
            border: 1px solid var(--hint-color);
            border-radius: 5px;
            color: var(--hint-color);
            cursor: pointer;
          }

          .value-control:hover {
            background: #eee;
          }

          .value-control:active {
            background: #ddd;
          }

          .value-input {
            background: transparent;
            margin: 0;
            height: 30px;
            width: 30px;
            border: 1px solid #777;
            border-radius: 5px;
            padding: 2px 8px;
            text-align: center;
            font-family: 'Montserrat';
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
          }
          .value-input:focus {
            outline: none;
          }

          .value-input:hover {
            border-color: #574426;
          }
          .btn-wrapper{
            display:flex;
            justify-content:center;
          }
          .compBtn {
            background: var(--main-color-dark);
            padding: 5px;
            width: 150px;
            border-radius: 5px;
            color: var(--main-color-bright);
            font-family: 'Noto Sans TC';
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            border: none;
          }
        `}
      </style>
    </>
  )
}
