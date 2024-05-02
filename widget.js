const preloadWigdetHTML = `

`

const calculateRoi = (data, days) => {
    if (days >= (data.Spot.length - days - 1)) {
        days = data.Spot.length - 1;
    }

    const initialBalance = data.FuturesUSDT[data.FuturesUSDT.length - days - 1].Balance + data.Spot[data.Spot.length - days - 1].Balance;
    const finalBalance = data.FuturesUSDT[data.FuturesUSDT.length - 1].Balance + data.Spot[data.Spot.length - 1].Balance;

    const roi = ((finalBalance - initialBalance) / initialBalance) * 100;

    return roi;
};

async function getApiData(id) {
    try {
        const response = await fetch(`http://92.63.96.151:3000/widget?id=${id}`)

        const data = await response.json();

        return data.data;
    } catch (error) {
        console.error(error);
    }
}


const widget = async (id) => {

    try {
        const data = await getApiData(id);

        let market = '';

        if (data.summaryInformationRatingTraders.profitabilityFuturesUSDT != 0) {
            market += `<div class="futures"><span>Futures</span></div>`;
        }
        if (data.summaryInformationRatingTraders.profitabilitySpot != 0) {
            market += `<div class="spot"><span>Spot</span></div>`;
        }

        //PnL

        let widgetHTML = `

    <div class="head">
        <img class="logo" src="${data.Logo}" alt="logo">
        <div>
            <p class="nickname">${data.Login}</p>
            <div class="market">${market}</div>
        </div>
    </div>

    <div class="wrap">
        <div class="stats">
        <div class="roinpnl el1">

            <div class="roi1">
                <div>
                    <p class="statname">ROI</p>
                    <div class="days">7d</div>
                </div>
                <p class="roi value days7">${calculateRoi(data, 7).toFixed(2)}%</p>
            </div>

            <div class="pnl">
            <canvas width="120" height="68"></canvas>
            </div>
        </div>
        
        <div class="roi2 el1">
            <div>
                <p class="statname">ROI</p>
                <div class="days">30d</div>
            </div>
            <p class="roi value days30">${calculateRoi(data, 30).toFixed(2)}%</p>
        </div>

        <div class="aum el1">
            <p class="statname">AUM</p>
            <p class="value">\$${data.summaryInformationRatingTraders.amountInManagment}</p>
        </div>

        <div class="exchange el1">
            <p class="statname">Биржи</p>
            <div class="exchanges"><img src="${data.Exchange}.png"></div>
        </div>
        </div>
    </div>

    <style>
        #widget-container p.days7{
            color: ${(calculateRoi(data, 7) > 0) ? "#36A889" : "#EA3943"}
        }
        #widget-container p.days30{
            color: ${(calculateRoi(data, 30).toFixed(2) > 0) ? "#36A889" : "#EA3943"};
        }
    </style>

    `
        const dataContainer = document.getElementById('widget-container');
        dataContainer.innerHTML = widgetHTML;

        try {
            const canvas = document.querySelector("canvas");
            const ctx = canvas.getContext("2d");

            ctx.width = 480;
            ctx.height = 272;

            ctx.imageSmoothingQuality = 'high';
            ctx.imageSmoothingEnabled = true;

            const dataChart = data.FuturesUSDT.map((el, index) => {
                return el.Profit;
            });

            const min = Math.min(...dataChart);
            const max = Math.max(...dataChart);
            const stepX = canvas.width / (dataChart.length - 1);
            const stepY = canvas.height / (max - min);

            ctx.beginPath();
            ctx.strokeStyle = (dataChart[dataChart.length - 1] >= dataChart[dataChart.length - 2]) ? "#36A889" : "#EA3943";
            ctx.lineWidth = 2

            for (let i = 0; i < dataChart.length; i++) {
                ctx.lineTo(i * stepX, canvas.height - (dataChart[i] - min) * stepY);
            }
            ctx.stroke();
        } catch (error) {
            console.log(error)
        }


    } catch (err) {
        console.log(err)
    }
}




