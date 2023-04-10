import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import Draggable from 'react-draggable';
import { Card, CardContent } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// prettier-ignore
import {
  get, getDefaults, dollars, exampleYield1, exampleYield2,
} from '../../store/Store';

import Logic from '../Logic';
import Help from '../../shared/Help';
import ClearInputs from '../ClearInputs';

const defaults = getDefaults('yield.yield|yield.q2|yield.price|yield.q4');

const Yield = () => {
  const state = useSelector(get.yield);
  const { typical } = state;
  const { adjusted } = state;
  const { impact } = state;
  const screenWidth = useSelector(get.screenWidth);

  const [plotLeft, setPlotLeft] = useState(0);

  useEffect(() => {
    const plot = document.querySelector('.highcharts-plot-background');
    if (plot) {
      const plotLeft2 = plot?.x?.baseVal.value;
      setPlotLeft(plotLeft2);
    }
  }, []);

  const dev = useSelector(get.dev);
  const cashCrop = useSelector(get.cashCrop) || ' your cash crop';

  const width = screenWidth > 1400 ? 400 : 700;
  const width2 = width / 5;

  Highcharts.setOptions({
    chart: {
      animation: false,
    },
    lang: {
      numericSymbols: null,
    },
    colors: ['#058DC7', 'orange'],
  });

  const chartOptions = {
    chart: {
      type: 'column',
      height: 100,
    },
    plotOptions: {
      series: {
        animation: false,
      },
    },
    title: {
      text: screenWidth > 1400 ? '' : 'Revenue',
    },
    xAxis: {
      tickLength: 0,
      labels: {
        enabled: false,
      },
      title: {},
    },
    yAxis: {
      title: {
        useHTML: true,
        text: `
          <div style="height: ${width2}px; display: flex;">
            <div style="align-self: flex-end;">dollars/acre</div>
          </div>
        `,
      },
      labels: {
        formatter() {
          // eslint-disable-next-line react/no-this-in-sfc
          return `$${this.axis.defaultLabelFormatter.call(this)}`;
        },
      },
    },
    series: [
      {
        showInLegend: false,
        data: impact,
      },
    ],
  };

  // prettier-ignore
  const chartStyle = (
    screenWidth > 1400
      ? {
        position: 'absolute',
        bottom: '2%',
        left: '1000px',
        background: '#eee',
        boxShadow: '2px 3px rgb(20 20 20 / 70%)',
        width,
      }
      : {
        width,
      }
  );

  return (
    <div className="Yield">
      <h1>Yield</h1>
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
        with a few fields having losses and with some fields showing no difference. However,
        the majority of growers responding reported yield benefits. The SARE/CTIC survey was
        conducted for several years with questions in 2015 and 2016 focused on the number of
        years of consecutive use of cover crops in fields and the impact on yield. The
        following table is regression analysis results of those surveys (approximately 500
        farmers each year for two years)
      </p>
      <div className="yield-img-div">
        <img alt="yield" src="yield.png" className="yield-img" />
      </div>

      <div className="mobile-table-div">
        <table style={{ maxWidth: 900 }} className="mobile-table">
          <tbody>
            <tr>
              <th colSpan="2">
                Yield
                <ClearInputs defaults={defaults} />
              </th>
            </tr>

            <Logic
              current="yield"
              property="yield"
              // prettier-ignore
              q={(
              // prettier-ignore
                <>
                  What is the expected yield for
                  {cashCrop}
                  in this field?
                  <Help>
                    <p>
                      User may enter their APH, trend adjusted APH, or typical yield for this
                      field.
                    </p>
                  </Help>
                </>
            )}
              a="number"
            />

            <Logic
              current="yield"
              property="q2"
              q="Do you want your financial analysis to use the typical yield estimates or the cover crop adjusted yield estimates?"
              a={['Use typical yield estimates', 'Use cover crop adjusted yield estimates']}
            />

            <Logic current="yield" property="price" q="Commodity price" a="dollar" />

            <Logic
              current="yield"
              property="q4"
              type="radio"
              q="Do you want your financial analysis to be based on anticipated yields in years 1, 3, or 5?"
              a={['1', '3', '5']}
            />
          </tbody>
        </table>
      </div>

      {adjusted[0] ? (
        <Draggable>
          <Card style={chartStyle}>
            <CardContent>
              <div>
                {screenWidth > 1400 && <strong className="cursor">Revenue</strong>}

                <HighchartsReact highcharts={Highcharts} options={chartOptions} />

                <div style={{ background: 'white' }}>
                  <table
                    style={{
                      width: 'calc(100% - 12px)',
                      textAlign: 'center',
                      font: '12px "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
                      color: '#444',
                      background: 'white',
                      border: 'none',
                    }}
                  >
                    <tbody>
                      <tr>
                        <td>Year</td>
                        <td>1</td>
                        <td>3</td>
                        <td>5</td>
                      </tr>
                      <tr>
                        <td style={{ width: plotLeft }}>
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
                        <td>{dollars(impact[0])}</td>
                        <td>{dollars(impact[1])}</td>
                        <td>{dollars(impact[2])}</td>
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
            </CardContent>
          </Card>
        </Draggable>
      ) : null}

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
