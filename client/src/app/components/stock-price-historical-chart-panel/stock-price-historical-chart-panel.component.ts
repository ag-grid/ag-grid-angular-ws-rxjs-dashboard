import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from "d3";
import {StockChartService} from "../../services/stock-chart.service";

@Component({
    selector: 'stock-price-historical-chart-panel',
    template: `
        <div style="margin-top: 5px" #historyGraph></div>
    `,
    styles: []
})
export class StockPriceHistoricalChartPanelComponent implements OnInit {
    private margin = {
        top: 20,
        right: 20,
        bottom: 50,
        left: 0
    };
    private graphHeight = 230;
    private graphWidth = 400;

    private historicalData: any;
    private y: any;
    private x: any;
    private renderingWidth: number;
    private renderingheight: number;
    private line: string;

    @ViewChild('historyGraph') private historyGraph: ElementRef;

    constructor(private stockChartService: StockChartService) {

        this.renderingWidth = this.graphWidth - this.margin.left - this.margin.right;
        this.renderingheight = this.graphHeight - this.margin.top - this.margin.bottom;

        this.x = d3.scaleTime()
            .range([0, this.renderingWidth]);

        this.y = d3.scaleLinear()
            .rangeRound([this.renderingheight, 0]);

        this.line = d3.line()
            .x(d => this.x(d.date))
            .y(d => this.y(d.price));
    }

    ngOnInit() {
        this.stockChartService.currentExchangeTickerData$.subscribe(
            (tickerDetail: any) => {
                this.historicalData = tickerDetail ? tickerDetail.historicalData : null;
                this.renderGraph();
            }
        );
    }

    renderGraph() {
        if (!this.historicalData) {
            return;
        }

        let data = this.historicalData;
        let parseTime = d3.timeParse("%d-%m-%Y");
        data.forEach((datum) => {
            datum.date = parseTime(datum.date);
            datum.price = +datum.price;
        });

        // clear out any previous graph
        d3.select(this.historyGraph.nativeElement)
            .selectAll("svg")
            .remove();

        // create a new one
        let svg = d3.select(this.historyGraph.nativeElement)
            .append('svg')
            .attr('height', this.graphHeight)
            .attr('width', this.graphWidth);

        let g = svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.x.domain(d3.extent(data, d => d.date));

        this.y.domain(d3.extent(data, d => d.price));

        let scale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, this.renderingWidth]);

        // Add the x Axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (this.renderingheight + 20 ) + ")")
            .call(d3.axisBottom(scale).tickFormat(d3.timeFormat("%Y-%m-%d")))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(55)")
            .style("text-anchor", "start");

        // Add the y Axis
        svg.append("g")
            .call(d3.axisLeft(this.y));

        g.append("g")
            .call(d3.axisLeft(this.y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 9)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Price ($)");

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", this.line);
    }

}
