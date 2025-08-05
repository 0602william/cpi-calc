const apiKey = "NGPRPTIQ1FRKENVWAMKG";

function convertDateToAPIFormat(dateStr) {
  const [year, month] = dateStr.split("-");
  return `${year}${month}`;
}

async function fetchCPI(date) {
  const dateStr = convertDateToAPIFormat(date);
  const url = `https://ecos.bok.or.kr/api/StatisticSearch/json/kr/${apiKey}/1/10/901Y014/M/${dateStr}/${dateStr}/`;
  const response = await fetch(url);
  const data = await response.json();
  return parseFloat(data?.StatisticSearch?.row?.[0]?.DATA_VALUE || 0);
}

async function calculateCPI() {
  const base = document.getElementById("baseDate").value;
  const compare = document.getElementById("compareDate").value;

  if (!base || !compare) {
    alert("날짜를 모두 선택해주세요.");
    return;
  }

  const cpiBase = await fetchCPI(base);
  const cpiCompare = await fetchCPI(compare);

  const inflationRate = ((cpiCompare - cpiBase) / cpiBase) * 100;

  document.getElementById("result").innerText = 
    `물가상승률: ${inflationRate.toFixed(2)}% (${base} → ${compare})`;

  drawChart(base, compare, cpiBase, cpiCompare);
}

function drawChart(base, compare, cpiBase, cpiCompare) {
  const ctx = document.getElementById("cpiChart").getContext("2d");
  if (window.cpiChart) window.cpiChart.destroy(); // 기존 차트 제거

  window.cpiChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [base, compare],
      datasets: [{
        label: "CPI",
        data: [cpiBase, cpiCompare],
        backgroundColor: ["#4CAF50", "#2196F3"]
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
