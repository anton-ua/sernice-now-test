import { createCustomElement, actionTypes } from "@servicenow/ui-core";
import snabbdom from "@servicenow/ui-renderer-snabbdom";
import "@servicenow/now-template-card";
import "@servicenow/now-modal";
import { createHttpEffect } from "@servicenow/ui-effect-http";
const { COMPONENT_BOOTSTRAPPED } = actionTypes;
import styles from "./styles.scss";

const view = (state, { dispatch }) => {
	const { result, modal } = state;
	return (
		<div>
			<h1>Incidents with modal</h1>
			<div className="container">
				{result.map((card) => {
					return (
						<now-template-card-assist
							tagline={{
								icon: "tree-view-long-outline",
								label: `${card.sys_class_name}`,
							}}
							actions={[
								{
									id: "share",
									label: "Open Record",
									clickActionType: "NOW_DROPDOWN_PANEL",
								},
								{ id: "close", label: "Mark Complete" },
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
			<now-modal
				headerLabel="Delete card"
				content="Are you sure you want to delete element? Doing so will remove all associated data."
				footerActions={[
					{
						label: "Delete",
						variant: "primary-negative",
					},
					{ label: "Cancel", variant: "secondary" },
				]}
				size="md"
				opened={modal}
			></now-modal>
		</div>
	);
};

createCustomElement("x-526950-incident-list-modal", {
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
		NOW_DROPDOWN_PANEL: ({ updateState }) => {
			updateState({ modal: true });
		},
		// HANDLE_DELETE: ({ dispatch }) => {
		// 	dispatch("FETCH_DELETE_CARD", {
		// 		sys_id,
		// 	});
		// },
		// FETCH_DELETE_CARD: createHttpEffect("api/now/table/incident/:sys_id", {
		// 	method: "GET",
		// 	successActionType: "USER_FETCH_",
		// }),
	},
	renderer: { type: snabbdom },
	view,
	styles,
});
