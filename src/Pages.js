import { Button } from "@mui/material";
import React, { useEffect } from "react";

import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
hljs.registerLanguage("python", python);

import "highlight.js/styles/tokyo-night-dark.css";
import { DBManager } from "./DB";

export function Notebook(props) {
	const [cells, setCells] = React.useState([]);
	const [ready, setReady] = React.useState(false);

	useEffect(() => {
		console.log("Setting cells");
		setReady(false);
		setCells(props.cells);

		// setCells(props.cells);
	}, [props.cells]);

	useEffect(() => {
		console.log("Setting ready", ready);
		if (ready == false) {
			setReady(true);
			console.log("highlighting");
			setTimeout(() => {
				hljs.highlightAll();
			}, 0.01);
		}
	}, [ready]);

	return (
		<div className="notebook-container">
			{ready ? (
				<>
					<div className="cell-container" key={"1"} id="1">
						{cells.map((cell, index) => {
							return (
								<div key={index} className="cell">
									<div className="cell-line" key={index}>
										<div className="cell-left">
											<p className="cell-index">[{index + 1}]:</p>
											<p className="cell-id">{cell.metadata.id}</p>
										</div>
										<pre style={{ width: "100%" }}>
											<code id={JSON.stringify(cell)} className="python">
												{cell.source.map((line, i) => {
													return (
														<div key={i} className="cell-code">
															{line}
														</div>
													);
												})}
											</code>
										</pre>
									</div>
								</div>
							);
						})}
					</div>
					<div className="notebook-footer">
						<Button
							variant="contained"
							color="warning"
							onClick={(e) => {
								// upload the database
								var input = document.createElement("input");
								input.type = "file";
								input.onchange = (e) => {
                                    var file = e.target.files[0];
                                    var reader = new FileReader();
                                    reader.onload = (e) => {
                                        var text = e.target.result;
                                        var temp = JSON.parse(text);
                                        DBManager.getInstance().setItems(temp);
                                        props.flop();
                                    };
                                    reader.readAsText(file);
                                }
								input.click();
							}}
						>
							Upload
						</Button>
						<Button
							variant="contained"
							color="success"
							onClick={(e) => {
								// download the database
								var temp = DBManager.getInstance().getItems();
								var json = JSON.stringify(temp, null, 4);
								var blob = new Blob([json], { type: "application/json" });
								var url = URL.createObjectURL(blob);
								var a = document.createElement("a");
								a.href = url;
								a.download = "notebook.tensorboard";
								a.click();
							}}
						>
							Save
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={(e) => {
								var json =
									props.start + JSON.stringify(cells, null, 4) + props.end;
								var blob = new Blob([json], { type: "application/json" });
								var url = URL.createObjectURL(blob);
								var a = document.createElement("a");
								a.href = url;
								a.download = "notebook.ipynb";
								a.click();
							}}
						>
							Download
						</Button>
					</div>
				</>
			) : (
				<>
					<div className="cell-container" key={"2"} id="2">
						{cells.map((cell, index) => {
							return (
								<div key={index} className="cell">
									<div className="cell-line" key={index}>
										<div className="cell-left">
											<p className="cell-index">[{index + 1}]:</p>
											<p className="cell-id">{cell.metadata.id}</p>
										</div>
										<pre style={{ width: "100%" }}>
											<code id={JSON.stringify(cell)} className="python">
												{cell.source.map((line, i) => {
													return (
														<div key={i} className="cell-code">
															{line}
														</div>
													);
												})}
											</code>
										</pre>
									</div>
								</div>
							);
						})}
					</div>
					<div className="notebook-footer">
						<Button variant="contained" color="warning" onClick={(e) => {}}>
							Save
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={(e) => {
								var json =
									props.start + JSON.stringify(cells, null, 4) + props.end;
								var blob = new Blob([json], { type: "application/json" });
								var url = URL.createObjectURL(blob);
								var a = document.createElement("a");
								a.href = url;
								a.download = "notebook.ipynb";
								a.click();
							}}
						>
							Download
						</Button>
					</div>
				</>
			)}
		</div>
	);
}

export function Web(props) {
	return (
		<iframe
			src="https://jupyterlite.github.io/demo/lab/index.html"
			width="100%"
			height="100%"
		></iframe>
	);
}

export function Raw(props) {
	return (
		<textarea
			autoCorrect="off"
			spellCheck="false"
			style={{
				width: "100%",
				height: "100%",
				backgroundColor: "transparent",
				border: "none",
				color: "white",
				fontSize: "0.8em",
			}}
			value={props.value}
		></textarea>
	);
}

