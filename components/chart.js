import { Bar, Doughnut, defaults  } from 'react-chartjs-2';

let arrayLabels = [];
let arrayTotal = [];
let arrayProfit = [];
let arrayDividend = [];

defaults.animation = false;

export default function Chart({ item }) {
	arrayLabels = [];
	arrayTotal = [];
	arrayProfit = [];
	arrayDividend = [];

	item.map(stock => {
		arrayLabels.push(stock._id);
		arrayTotal.push(stock.qty * stock.marketPrice);
		arrayProfit.push((stock.qty * stock.marketPrice) - stock.total);
		arrayDividend.push(stock.dividend);
	});

	return (
		<div className="charts">
			{/* <div style={{ width: '40%', marginBottom: 32, }}>
				<Doughnut 
					data={{
						labels: arrayLabels,
						datasets: [
							{
								data: arrayTotal,
								backgroundColor: 'rgb(0, 175, 75)',
							},
						],
					}} 
					options={{
						responsive: true,
						plugins: {
							legend: {
								position: 'bottom',
							},
						},
					}}
				/>
			</div> */}

			<div style={{ width: '100%', }}>
				<Bar 
					data={{
						labels: arrayLabels,
						datasets: [
							{
								label: 'Lucro',
								data: arrayProfit,
								backgroundColor: 'rgb(0, 175, 75)',
							}, {
								label: 'Dividendos',
								data: arrayDividend,
								backgroundColor: 'rgb(0, 75, 145)',
							}
						],
					}}
					options={{
						responsive: true,
						plugins: {
							legend: {
								 position: 'top',
							},
							tooltip: {
								callbacks: {
									label: function(context) {
										var label = context.dataset.label || '';
				
										if (label)
											label += ': ';
				
										if (context.parsed.y !== null)
											label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
				
										return label;
									},
									footer: function(tooltipItems) {
										let sum = 0;

										tooltipItems.forEach(function(tooltipItem) {
											sum += tooltipItem.parsed.y;
										});

										return 'Total: ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sum);
									},
								},
							},
						},
						scales: {
							x: {
								// stacked: true,
							},
							y: {
								// stacked: true,
								beginAtZero: true,
							},
						},
					}}
				/>
			</div>
		</div>
	);
}
