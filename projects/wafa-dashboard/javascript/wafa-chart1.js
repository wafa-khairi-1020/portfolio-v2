am5.ready(function () {

    var root = am5.Root.new("chartdiv");

    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none"
        })
    );

    function buildData() {
        var months = (window.__t && window.__t("months")) || [
            "Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr"
        ];
        var values = [1000, 1600, 1500, 1200, 1000, 700, 600];
        var lines = [20, 40, 35, 30, 25, 15, 10];
        return months.slice(0, 7).map(function (m, i) {
            return { month: m, value: values[i], line: lines[i] };
        });
    }

    var data = buildData();

    var xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
            categoryField: "month",
            renderer: am5xy.AxisRendererX.new(root, {})
        })
    );
    xAxis.data.setAll(data);

    var yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            min: 0,
            renderer: am5xy.AxisRendererY.new(root, {})
        })
    );

    var yAxis2 = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            min: 0,
            max: 50,
            renderer: am5xy.AxisRendererY.new(root, { opposite: true })
        })
    );

    var series1 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
            name: "Income",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            categoryXField: "month"
        })
    );

    series1.columns.template.setAll({
        cornerRadiusTL: 10,
        cornerRadiusTR: 10,
        fillOpacity: 0.9,
        fill: am5.color(0x10b981),
        stroke: am5.color(0x10b981)
    });

    series1.data.setAll(data);

    var series2 = chart.series.push(
        am5xy.LineSeries.new(root, {
            name: "Percent",
            xAxis: xAxis,
            yAxis: yAxis2,
            valueYField: "line",
            categoryXField: "month",
            strokeWidth: 3,
            stroke: am5.color(0xf59e0b),
            fill: am5.color(0xf59e0b)
        })
    );

    series2.bullets.push(function () {
        return am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
                radius: 5,
                fill: series2.get("stroke")
            })
        });
    });

    series2.data.setAll(data);

    window.__barChart = {
        root: root,
        xAxis: xAxis,
        series1: series1,
        series2: series2,
        rebuild: function () {
            var d = buildData();
            xAxis.data.setAll(d);
            series1.data.setAll(d);
            series2.data.setAll(d);
        }
    };
});
