import { createCustomElement, actionTypes } from "@servicenow/ui-core";
import snabbdom from "@servicenow/ui-renderer-snabbdom";
import "@servicenow/now-template-card";
import { createHttpEffect } from "@servicenow/ui-effect-http";
const { COMPONENT_BOOTSTRAPPED } = actionTypes;
import styles from "./styles.scss";

const view = (state, { updateState }) => {
	const { result } = state;
	console.log(result);
	return (
		<div>
			<h1>Incidents</h1>
			<div className="container">
				{result &&
					result.map((card) => {
						return (
							<now-template-card-assist
								tagline={{
									icon: "tree-view-long-outline",
									label: `${card.sys_class_name}`,
								}}
								actions={[
									{ id: "share", label: "Copy URL" },
									{ id: "close", label: "Delete" },
								]}
								heading={{
									label: `${card.description}`,
								}}
								content={[
									{
										label: "Number",
										value: { type: "string", value: `${card.number}` },
									},
									{
										label: "State",
										value: { type: "string", value: `${card.incident_state}` },
									},
									{
										label: "Assignment Group",
										value: {
											type: "string",
											value: `${card.assignment_group.display_value}`,
										},
									},
									{
										label: "Assigned To",
										value: {
											type: "string",
											value: `${card.assigned_to.display_value}`,
										},
									},
								]}
								footerContent={{
									label: "Updated",
									value: `${card.sys_updated_on}`,
								}}
								configAria={{}}
								contentItemMinWidth="400"
							/>
						);
					})}
			</div>
		</div>
	);
};

createCustomElement("x-526949-incident-list", {
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: ({ dispatch }) => {
			dispatch("FETCH_USER_EFFECT", {
				sysparm_display_value: true,
			});
		},

		FETCH_USER_EFFECT: createHttpEffect("api/now/table/incident", {
			method: "GET",
			queryParams: ["sysparm_display_value"],
			successActionType: "USER_FETCH_SUCCESS",
		}),

		USER_FETCH_SUCCESS: ({ action, updateState }) => {
			const { result } = action.payload;

			updateState({ result });
		},
	},
	renderer: { type: snabbdom },
	view,
	styles,
});
