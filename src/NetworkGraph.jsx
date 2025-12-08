import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const NetworkGraph = ({ data, onSelectNode, selectedNodeId }) => {
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Handle Resize
    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!data) return;

        const { width, height } = dimensions;
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Create a container group for zooming
        const container = svg.append("g");

        // Zoom Behavior
        const zoom = d3.zoom()
            .scaleExtent([0.5, 4])
            .on("zoom", (event) => {
                container.attr("transform", event.transform);
            });

        svg.call(zoom);

        // Initial Positions (Centered)
        const cy = height / 2;
        const cx_input = width * 0.2;
        const cx_hidden = width * 0.5;
        const cx_output = width * 0.8;

        const nodes = [
            { id: 'input', type: 'input', x: cx_input, y: cy, val: data.input, label: 'INPUT' },
            { id: 'h1', type: 'hidden', index: 0, x: cx_hidden, y: cy - 120, val: data.hidden[0], label: 'H1' },
            { id: 'h2', type: 'hidden', index: 1, x: cx_hidden, y: cy + 120, val: data.hidden[1], label: 'H2' },
            { id: 'output', type: 'output', x: cx_output, y: cy, val: data.output, label: 'OUTPUT' }
        ];

        const links = [
            { source: nodes[0], target: nodes[1], weight: data.weights.w1[0] },
            { source: nodes[0], target: nodes[2], weight: data.weights.w1[1] },
            { source: nodes[1], target: nodes[3], weight: data.weights.w2[0] },
            { source: nodes[2], target: nodes[3], weight: data.weights.w2[1] }
        ];

        // --- Drawing ---

        // 1. Links
        container.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", d => Math.abs(d.weight) * 3 + 1)
            .attr("stroke-opacity", d => d.weight < 0 ? 0.15 : 0.5)
            .attr("stroke-dasharray", d => d.weight < 0 ? "4,4" : "none");

        // 2. Particles (The "Oomph")
        // We animate circles along the paths
        links.forEach(link => {
            if (Math.abs(link.weight) < 0.1) return; // Ignore weak links

            const particle = container.append("circle")
                .attr("r", 3)
                .attr("fill", "#fff")
                .attr("opacity", 0.8);

            const animate = () => {
                particle
                    .attr("cx", link.source.x)
                    .attr("cy", link.source.y)
                    .transition()
                    .duration(1000 + Math.random() * 500)
                    .ease(d3.easeLinear)
                    .attr("cx", link.target.x)
                    .attr("cy", link.target.y)
                    .on("end", animate);
            };
            animate();
        });


        // 3. Nodes
        const nodeGroups = container.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                event.stopPropagation();

                // Trigger Component Action
                onSelectNode && onSelectNode(d);

                // Cinematic Pan/Zoom
                // Center the clicked node
                // Transform: translate(width/2 - x*k, height/2 - y*k) scale(k)
                const scale = 2;
                const tx = width / 2 - d.x * scale;
                const ty = height / 2 - d.y * scale;

                svg.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity.translate(tx, ty).scale(scale)
                );
            });

        // Outer Ring
        nodeGroups.append("circle")
            .attr("r", 45)
            .attr("stroke", "#444")
            .attr("stroke-width", 1)
            .attr("fill", "#050505");

        // Activation Core
        nodeGroups.append("circle")
            .attr("r", d => 40 * d.val + 5)
            .attr("fill", "#fff")
            .attr("opacity", d => 0.2 + (d.val * 0.8));

        // Labels
        nodeGroups.append("text")
            .attr("dy", 70)
            .text(d => d.label)
            .attr("text-anchor", "middle")
            .attr("fill", "#666")
            .attr("font-size", "14px")
            .style("letter-spacing", "2px");

        // Reset Zoom on Background Click
        svg.on("click", () => {
            onSelectNode(null);
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity // Reset
            );
        });

    }, [data, dimensions]); // Note: selectedNodeId dependency removed to prevent re-draw on selection

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <svg ref={svgRef} width="100%" height="100%"></svg>
        </div>
    );
};

export default NetworkGraph;
