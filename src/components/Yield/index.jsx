import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import Help from '../../shared/Help';
import Input from '../../shared/Inputs';
import {
  dev,
  dollars,
  exampleYield1,
  exampleYield2,
  get,
  getDefaults,
  set,
} from '../../store/Store';
import ClearInputs from '../ClearInputs';

import './styles.scss';

const defaults = getDefaults(['yield.yield', 'yield.q2', 'yield.price', 'yield.q4']);

const RevenueGraph = ({ className }) => {
  const state = useSelector(get.yield);
  const { typical, adjusted, impact, q4 } = state;

  if (!adjusted[0]) {
    return null;
  }

  const data = [1, 3, 5].map((year, index) => ({
    year,
    impact: impact[index],
  }));

  const min = Math.floor(Math.min(0, ...impact) / 5) * 5;
  const max = Math.ceil(Math.max(0, ...impact) / 5) * 5;
  const ticks = Array.from({ length: (max - min) / 5 + 1 }, (_, i) => min + i * 5);

  return (
    <div id="RevenueGraph" className={className}>
      <div style={{ textAlign: 'center' }}>Revenue</div>

      <BarChart
        width={400}
        height={100}
        data={data}
        margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
      >
        <XAxis dataKey="year" hide />
        <YAxis
          width={100}
          domain={[min, max]}
          ticks={ticks}
          allowDecimals={false}
          tickFormatter={(value) => `$${value}`}
          label={{
            value: 'dollars/acre',
            angle: -90,
            position: 'insideLeft',
            offset: 45,
            style: { textAnchor: 'middle', fontSize: 12 },
          }}
        />
        <Tooltip
          labelFormatter={(year) => `Yield impact in year ${year}`}
          formatter={(value) => [`$${Number(value).toFixed(2)}/acre`, 'Impact']}
        />
        <Bar dataKey="impact" fill="#058DC7" barSize={44} isAnimationActive={false} />
      </BarChart>
      <div>
        <table id="ChartTable">
          <tbody>
            <tr>
              <td>Year</td>
              <td>1</td>
              <td>3</td>
              <td>5</td>
            </tr>
            <tr>
              <td>
                <div
                  style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    background: '#058DC7',
                    marginRight: 4,
                  }}
                />
                Cover crop yield impact
                <br />
                ($/acre)
              </td>
              <td className={q4 === '1' ? 'selected' : ''}>{dollars(impact[0])}</td>
              <td className={q4 === '3' ? 'selected' : ''}>{dollars(impact[1])}</td>
              <td className={q4 === '5' ? 'selected' : ''}>{dollars(impact[2])}</td>
            </tr>
            <tr>
              <td>
                Typical Yield
                <br />
                ($/acre)
              </td>
              <td>{dollars(typical)}</td>
              <td>{dollars(typical)}</td>
              <td>{dollars(typical)}</td>
            </tr>
            <tr>
              <td>
                Cover Crop Adjusted Yield
                <br />
                ($/acre)
              </td>
              <td>{dollars(adjusted[0])}</td>
              <td>{dollars(adjusted[1])}</td>
              <td>{dollars(adjusted[2])}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}; // RevenueGraph

const Yield = () => {
  const cashCrop = useSelector(get.cashCrop) || ' your cash crop';
  const state = useSelector(get.yield);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(set.yield.q4('1'));
  }, [dispatch]);

  return (
    <div id="Yield" className="yield">
      <h1>Yield</h1>
      {['Corn', 'Soybeans'].includes(cashCrop) ? (
        <>
          <p>
            When using cover crops in your rotation, yields of your cash crops may be affected.
            Results from farmer surveys indicate many farmers report a yield increase when using
            cover crops, although experiences have also resulted in decreased yields under certain
            conditions. Survey results also indicate experience matters. Growers that have utilized
            cover crops on their farms for more consecutive years report greater yield benefits.
          </p>
          <p>
            The Sustainable Agriculture Research &amp; Education program (
            <a target="_blank" rel="noreferrer" href="https://www.sare.org">
              https://www.sare.org
            </a>
            ) aggregated survey data of farmers responding to the SARE/CTIC National Cover Crop
            Survey in a June 2019 SARE Technical Bulletin titled, Cover Crop Economics. The SARE
            publication notes,
          </p>
          <blockquote>
            &quot;To better understand how the number of years spent planting a cover crop impacts
            crop yield, data was collected from farmers responding to the SARE/CTIC National Cover
            Crop Survey. Farmers who planted cover crops on some fields but not on others, and who
            otherwise managed those fields similarly, were asked to report on respective
            yields.&quot;
          </blockquote>
          <p>
            The authors note that yields were self-reported and yields varied from field to field,
            with a few fields having losses and with some fields showing no difference. However, the
            majority of growers responding reported yield benefits. The SARE/CTIC survey was
            conducted for several years with questions in 2015 and 2016 focused on the number of
            years of consecutive use of cover crops in fields and the impact on yield. The following
            table is regression analysis results of those surveys (approximately 500 farmers each
            year for two years)
          </p>
        </>
      ) : (
        <>
          <p>
            When using cover crops in your rotation, yields of your cash crops may be affected. No
            reliable data exists for the impact of cover crops on {cashCrop}. Results from farmer
            surveys indicate many farmers report a yield increase when using cover crops, although
            experiences have also resulted in decreased yields under certain conditions. Survey
            results also indicate experience matters. Growers that have utilized cover crops on
            their farms for more consecutive years report greater yield benefits.
          </p>
          <p>
            Users are encouraged to talk with their local Extension professional or farmers who have
            experience with planting cover crops prior to {cashCrop}.
          </p>
        </>
      )}

      {['Corn', 'Soybeans'].includes(cashCrop) && (
        <table className="sare">
          <caption>
            Percent increase in corn and soybean yields after one, three and five years of
            consecutive cover crop use on a field, based on a regression analysis of data for crop
            years 2015 and 2016 <sup>1</sup>
          </caption>
          <thead>
            <tr>
              <td />
              <th>ONE YEAR</th>
              <th>THREE YEARS</th>
              <th>FIVE YEARS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Corn</td>
              <td>0.52%</td>
              <td>1.76%</td>
              <td>3.00%</td>
            </tr>
            <tr>
              <td>Soybeans</td>
              <td>2.12%</td>
              <td>3.54%</td>
              <td>4.96%</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>
                <sup>1</sup> Figures shown are an average of yields from the 2015 and 2016 growing
                seasons, with yield data obtained from about 500 farmers each year through the
                SARE/CTIC National Cover Crop Survey.
              </td>
            </tr>
          </tfoot>
        </table>
      )}

      <div className="yieldTable">
        <table
          id="YieldTable"
          style={
            ['Corn', 'Soybeans'].includes(cashCrop)
              ? { width: '100%' }
              : { width: '70%', marginLeft: 'auto', marginRight: 'auto' }
          }
        >
          <caption>
            Yield
            <ClearInputs defaults={defaults} />
          </caption>
          <tbody>
            {['Corn', 'Soybeans'].includes(cashCrop) && (
              <tr>
                <td>
                  What is the expected yield for {cashCrop} in this field?
                  <Help>
                    <p>
                      You may enter your APH, trend adjusted APH, or typical yield for this field.
                    </p>
                  </Help>
                </td>
                <td style={{ background: '#dfd' }}>
                  <Input id="yield.yield" type="number" />
                </td>
                <td rowSpan="4" className="revenue">
                  <RevenueGraph className="desktop" />
                </td>
              </tr>
            )}

            <tr>
              {['Corn', 'Soybeans'].includes(cashCrop) ? (
                <td>Select the change in yields you expect from adoption of cover crops</td>
              ) : (
                <td className="reducedQuestion">
                  What is the expected change in {cashCrop} yield you expect following your
                  selection of a cover crop
                </td>
              )}

              <td className={['Corn', 'Soybeans'].includes(cashCrop) ? '' : 'reducedAnswer'}>
                <Input
                  id="yield.q2"
                  options={
                    ['Corn', 'Soybeans'].includes(cashCrop)
                      ? [
                          'No change in yield estimates',
                          'Use cover crop adjusted yield estimates from the table above',
                          'Enter my own estimated yield change',
                        ]
                      : ['Enter my own estimated yield change']
                  }
                  type="radio"
                />
                {/Enter my own estimated yield change/.test(state.q2) && (
                  <span style={{ display: 'flex', marginLeft: '10%' }}>
                    <Input id="yield.manualYieldEstimate" type="number" />
                    <span style={{ margin: '2% 0 0 2%' }}>bushels/acre change</span>
                  </span>
                )}
              </td>
            </tr>

            <tr>
              <td>Commodity price</td>
              <td style={{ background: '#dfd' }}>
                <Input id="yield.price" type="dollar" />
              </td>
            </tr>

            {!/Enter my own estimated yield change/.test(state.q2) && (
              <tr>
                <td>
                  Do you want your financial analysis to be based on anticipated yields in years 1,
                  3, or 5?
                </td>
                <td>
                  <Input id="yield.q4" options={['1', '3', '5']} type="radio" />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <RevenueGraph className="mobile" />
      </div>

      {dev && (
        <div className="test-buttons">
          <button type="button" onClick={exampleYield1}>
            Test Soybeans
          </button>
          <button type="button" onClick={exampleYield2}>
            Test Corn
          </button>
        </div>
      )}
    </div>
  );
}; // Yield

Yield.menu = (
  <span>
    <u>Y</u>
    ield
  </span>
);

export default Yield;
