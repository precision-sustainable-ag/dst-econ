const rates = `
parameter	description	value
skilled	Skilled Labor Rate $/hr.	30
unskilled	Unskilled Labor Rate $/hr.	24
interest	Interest Rate, % of average investment	0.04
insurance	Insurance Rate	0.0085
fuel	Fuel price, $/gallon	2.5
lubrication	Lubrication cost, % of fuel	0.1
storage	Storage Cost/Sq. Foot of Space	0.969218963
inflation	Inflation Rate, % per year	0
forecast	2020 U.S. net farm income forecast ($ billions)	111.4
deflator	GDP implicit price deflator, 2020 4th quarter	114.4
deflator1996	GDP implicit price deflator, 1996	76.783
projected	Real Net Farm Income projected at trade-in, in $ billion 1996 dollars	74.76945979
conversion	Acres Conversion factor (=43560 ft2/ac * mi/5280ft)	8.25
horsepower	Self propelled assumed horsepower (for fuel calcs)	80
property	Property taxes	0.005
`;

export default rates;